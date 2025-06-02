import { NextFunction , Request , Response } from "express";
import { usersModel } from "../models/user.model";
import { messagesModel } from "../models/message.model";
import { getAuth } from "@clerk/express";

export const getUsers = async (req : Request , res : Response, next : NextFunction)=>{
    try {
        const currentUserId = req.auth.userId
        const users = await  usersModel.find({clerkId : {$ne : currentUserId}}).sort({createdAt : -1})
        return res.status(200).json({
            message : 'users fetched succesfully',
            success : true ,
            data : users
        })
    } catch (error) {
        next(error)
    }
}

export const addToFavouriteSongs = async (req : Request , res : Response , next : NextFunction)=>{
    try {
        const {songId} = req.params
        if (!songId){
            return {
                message : "Id Is Required",
                success : false,
            }
        }
        const currentUserClerkId = req.auth.userId
        const user = await usersModel.findOne({clerkId : currentUserClerkId})
        if (!user){
            return {
                message : "User Not Found",
                success : false
            }
        }
        //check if user songs include song id
        if (user.favouriteSongs.includes(songId)){
            // if includes scenario
            user.favouriteSongs = user.favouriteSongs.filter((id : string) => id.toString() !== songId)
            await user.save()
            return res.status(200).json({
                message : "Song Removed From Favourite Songs",
                success : true
            })
        }else{
            // if not includes scenario
            user.favouriteSongs.push(songId)
            await user.save()
            return res.status(200).json({
                message : "Song Added To Favourite Songs",
                success : true
            })
        }  
    } catch (error) {
        next(error)
    }
}

export const getMessages = async (req : Request , res : Response , next : NextFunction)=>{
    try {
        const {id : receiverId} = req.params
        const {userId : currentUserId} = getAuth(req)
        const messages = await messagesModel.find({
            $or : [
                { senderId: receiverId, receiverId: currentUserId },
				{ senderId: currentUserId, receiverId: receiverId },
            ]
        }).sort({createdAt : -1})
        return res.status(200).json({
            message : "Messages Fetched Successfully",
            success : true,
            data : messages
        })
    } catch (error) {
        next(error)
    }
}

export const getFavouriteSongs = async (req : Request , res : Response , next : NextFunction)=>{
    try {
        const userId = req.auth.userId
        if (!userId){
            return res.status(400).json({
                message : "Id Is Required",
                success : false
            })
        }
        const user = await usersModel.findOne({clerkId : userId}).populate('favouriteSongs')
        if (!user){
            return res.status(404).json({
                message : "User Not Found",
                success : false
            })
        }

        return res.status(200).json({
            message : "Favourite Songs Fetched Successfully",
            success : true,
            data : user.favouriteSongs
        })
    } catch (error) {
        next(error)
    }
}