const db = require('../services/database');
const _ = require('lodash');
const anchor = require('@project-serum/anchor');
const { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } = require('@solana/spl-token');
const config = require('../generic/config');
const uuid = require('uuid').v4;
const bs58 = require('bs58');
const { Keypair } = require('@solana/web3.js');
const ENV = config.blockchain.solanaNet;
console.log('ENV', ENV);
let node = ENV;
if (!node.includes('http')) {
    node = anchor.web3.clusterApiUrl(ENV);
}
const web3 = new anchor.web3.Connection(node, 'confirmed');
const stakingController = require('./staking');
const tiers = config.staking.tiers;

const {
    ValidationError,
    NotFoundError
} = require('../generic/errors');

module.exports = {
    payload: ctx => {
        const { user } = ctx.state;

        ctx.ok(user);
    },
    updateUser: async ctx => {
        const { user } = ctx.state;
        const userData = ctx.request.body;
        const updated = await db('user')
            .where({ id: user.id })
            .update({
                // User cannot yet update any user info
            });
        if(!updated) {
            throw new Error('Could not update user');
        }
        const updatedUser = await db('user')
            .first()
            .where({ id: user.id });

        if(!updatedUser) throw new NotFoundError('user not found');
        ctx.ok(_.omit(updatedUser, ['private_key']));
    },

    updateProject: async ctx => {
        const { user } = ctx.state;
        const projectData = ctx.request.body;
        const updated = await db('project')
            .where({ user_id: user.id })
            .update({
                name: projectData.name,
                first_name: projectData.firstName,
                last_name: projectData.lastName,
                email: projectData.email,
                discord: projectData.discord,
                github: projectData.github,
                twitter: projectData.twitter,
                country: projectData.country,
                want_to_develop: projectData.wantToDevelop,
                want_to_earn: projectData.wantToEarn,
                want_to_participate_nft: projectData.wantToParticipateNft,
                image: projectData.image,
                completion_index: projectData.completionIndex
            });
        if(!updated) {
            throw new Error('Could not update project');
        }

        const updatedProject = await db('user')
            .first()
            .leftJoin('project', 'user.id', 'project.user_id')
            .where({ 'user.id': user.id });

        if(!updatedProject) throw new NotFoundError('project not found');
        ctx.ok(_.omit(updatedProject, ['private_key']));
    },

    getUser: async ctx => {
        const { user } = ctx.state;

        const dbUser = await db('user')
            .first()
            .leftJoin('project', 'user.id', 'project.user_id')
            .where({ 'user.id': user.id });

        if(!dbUser) throw new NotFoundError('user not found');
        ctx.ok(_.omit(dbUser, ['private_key']));
    },
    getUserById: async ctx => {
        const { user } = ctx.state;
        const { id } = ctx.params;
        const project = await db('user')
        .first()
        .select('user.id as id', 'address', 'name', 'description', 'image', 'discord', 'generated_address', 'email')
        .leftJoin('project', 'user.id', 'project.user_id')
        .where({ 'user.id': id });;

        if (!user || !user.roles.includes('admin')) {
            delete project['email'];
            delete project['discord'];
        }

        ctx.ok(project);
    },
    getStake: async ctx => {
        try {
            let { user } = ctx.state;
            let { userAddress } = ctx.request.query;
            
            if (user) {
                userAddress = (await db('user')
                    .first()
                    .select('address')
                    .where({'user.id': user.id })).address;
            } else {
                if (!userAddress) {
                    throw new Error('Account does not exist');
                }
            }
            wallet = anchor.web3.Keypair.generate();

            const provider = new anchor.AnchorProvider(web3, wallet, {});
            let userKey = new anchor.web3.PublicKey(userAddress);

            const programId = new anchor.web3.PublicKey(config.blockchain.stakeProgramId);
            const mint = new anchor.web3.PublicKey(config.blockchain.nosTokenProgramId);
            const accounts = {
                // solana native
                systemProgram: anchor.web3.SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                tokenProgram: TOKEN_PROGRAM_ID,
                feePayer: userKey,
                // custom
                authority: userKey,
                ataFrom: await getAssociatedTokenAddress(mint, userKey),
                ataVault: undefined,
                stake: undefined,
                stats: undefined,
                mint
            };
            const idl = await anchor.Program.fetchIdl(config.blockchain.stakeProgramId, provider);
            const program = new anchor.Program(idl, programId, provider);
            // get pda
            [accounts.ataVault] = await anchor.web3.PublicKey.findProgramAddress(
                [mint.toBuffer()],
                programId
            );
            [accounts.stats] = await anchor.web3.PublicKey.findProgramAddress(
                [anchor.utils.bytes.utf8.encode('stats')],
                programId
            );
            [accounts.stake] = await anchor.web3.PublicKey.findProgramAddress(
                [anchor.utils.bytes.utf8.encode('stake'), mint.toBuffer(), userKey.toBuffer()],
                programId
            );
            const stakeData = await program.account.stakeAccount.fetch(accounts.stake);
            if (!user) {
                user = await db('user')
                    .first()
                    .where({'user.address': userAddress });

                // create new user
                if (!user) {
                    const keypair = Keypair.generate();
                    let newUser = {
                        address: userAddress,
                        generated_address: keypair.publicKey.toString(),
                        private_key: bs58.encode(keypair.secretKey)
                    };
                    newUser.id = uuid();
                    await db('user').insert(newUser);
                    user = await db('user')
                        .first()
                        .where({'user.address': userAddress });
                }
            }
            // insert or update new stake data
            await db('stake')
                .insert({
                    user_id: user.id,
                    amount: String(stakeData.amount),
                    duration: String(stakeData.duration),
                    time_unstake: String(stakeData.timeUnstake),
                    xnos: String(stakeData.xnos),
                    'updated_at': db.fn.now()
                })
                .onConflict('user_id')
                .merge('amount', 'duration', 'xnos', 'time_unstake', 'updated_at');
            const updatedStake = await db('stake')
                .first()
                .select('xnos', 'user_id', 'user.address', 'time_unstake', 'amount', 'duration')
                .where({ user_id: user.id })
                .leftJoin('user', 'user_id', 'user.id');
            updatedStake.tierInfo = await getUserTierInfo(updatedStake);
            ctx.ok(updatedStake);

        } catch (error) {
            console.log('error', error);
            if (!error.message.includes('Account does not exist')) {
                throw new Error(error.message);
            } else {
                // the user hasn't staked anything yet, but we still need the tier info
                const orderedTiers = await stakingController.generateTierLists();
                ctx.ok({
                    tierInfo: {
                        tiers: orderedTiers.map(({ stakes, ...tier }) => tier)
                    }
                });
            }
        }
    }

};

async function getUserTierInfo (userStake) {
    try {
        const orderedTiers = await stakingController.generateTierLists();
        let userTier = null;

        // Look which tier the user fits
        for (let i = 0; i < orderedTiers.length; i++) {
            if (parseFloat(userStake.xnos) >= parseFloat(orderedTiers[i].requiredXNOS)) {
                userTier = orderedTiers[i];
                break;
            }
        }

        // we don't have to return the stakes for the userTier
        if (userTier) {
            delete userTier.stakes;
        }
        return {
            userTier: userTier,
            tiers: orderedTiers.map(({ stakes, ...tier }) => tier)
        };
    } catch (error) {
        console.error(error);
    }
}
