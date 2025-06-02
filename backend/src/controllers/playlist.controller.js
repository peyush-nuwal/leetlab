import {db} from "../libs/db.js"

export const getAllListDetails = async(req, res) => {
    try {
        const playlists = await db.playlist.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "Playlists fetched successfully",
            playlists
        })

    } catch (error) {
        console.log("Error in fetching playlist: ", error);
        res.status(400).json({
            error: "Failed to fetch playlists"
        })
    }
}

export const getPlaylistDetails = async(req, res) => {
    const { playlistId } = req.params;

    try {
        const playlist = await db.playlist.findUnique({
            where: {
                id: playlistId,
                userId: req.user.id
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        })

        if (!playlist) {
            return res.status(404).json({
                error: "Playlist not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            playlist
        })

    } catch (error) {
        console.log("Error in fetching playlist: ", error);
        res.status(400).json({
            error: "Failed to fetch playlist"
        })
    }
}

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

