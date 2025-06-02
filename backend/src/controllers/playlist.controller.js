import {db} from "../libs/db.js"

export const getAllListDetails = async(req, res) => {
    
}

export const getPlaylistDetails = async(req, res) => {}

export const createPlaylist = async(req, res) => {
    try {
        const { name, description } = req.body;

        const userId = req.user.id;

        const playlist  = await db.playlist.create({
            data: {
                name,
                description,
                userId
            }
        });

        res.status(200).json({
            success: true,
            message: "Playlist created suceessfully",
            playlist
        })

    } catch (error) {
        console.log("Error in creating playlist: ", error);
        res.status(400).json({
            error: "Failed to create playlist"
        })
    }
}

export const addProblemToPlaylist = async(req, res) => {}

export const deletePlaylist = async(req, res) => {}

export const removeProblemFromPlaylist = async(req, res) => {}

