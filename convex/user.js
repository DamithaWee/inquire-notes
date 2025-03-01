import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser=mutation({
    args: {
        email: v.string(),
        username: v.string(),
        imageUrl: v.string()
    },

    handler: async(ctx, args) => {
        const user = await ctx.db.query('users')
        .filter((q)=> q.eq(q.field('email'), args.email))
        .collect()

        if (user.length == 0) {
            await ctx.db.insert('users',{
                email: args.email,
                username: args.username,
                imageUrl: args.imageUrl,
                upgrade: false
            })

            return 'User created successfully'
        }
        return 'User already exists'
    }
})


export const userUpgradePlan=mutation({
    args:{
        userEmail: v.string(),
        
    },
    handler:async (ctx, args) => {
        c

        if(result){
            await ctx.db.patch(result[0]._id, {upgrade:true});
            return 'User upgraded successfully'
        }

        return 'User not found'
    }
})

export const getUserInfo = query({
    args:{
        userEmail: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if(!args?.userEmail){
            return
        }        

        const result = await ctx.db.query('users')
        .filter((q) => q.eq(q.field('email'), args?.userEmail))
        .collect();
    
        return result[0]
    }

})