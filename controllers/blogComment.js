const Blog = require('../models/Blog');
const BlogComment = require('../models/Comment');
const mongoose = require('mongoose')

//user adding comment
exports.create = async (req, res) => {
    let blog_id = req.params.blog_id;

    //checking if ObjectId is valid
    if(!mongoose.Types.ObjectId.isValid(blog_id)){
		return res.status(400).send({
	  		message:'Invalid blog id',
	  		data:{}
	  	});
	}
	Blog.findOne({_id:blog_id}).then(async (blog)=>{
		if(!blog){
			return res.status(400).send({
				message:'No Blog found',
				data:{}
			});	
		}else{
			try{
				let newCommentDocument = new BlogComment({
					comment: req.body.comment,
					blog_id: blog_id,
					user_id: req.user._id
				});

				let commentData = await newCommentDocument.save();
                let query = [
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "user_id",
                            foreignField: "_id",
                            as: "user"
                        }
                    },
                    { $unwind: '$user' },
                    {
                        $match: {
                            '_id': new mongoose.Types.ObjectId(commentData._id)
                        }
                    },

				];

				let comments = await BlogComment.aggregate(query);

				return res.status(200).send({
					message:'Comment successfully added',
					data:comments[0]
				});

			}catch(err){
				return res.status(400).send({
			  		message:err.message,
			  		data:err
			  	});
			}
		}
	}).catch((err)=>{
		return res.status(400).send({
	  		message:err.message,
	  		data:err
	  	});
	})
}