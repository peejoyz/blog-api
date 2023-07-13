const Blog = require('../models/Blog')
const Like = require('../models/Like')
const mongoose = require('mongoose')
// const Author = require('../models/Author')

exports.getAllBlog = async (req, res) => {
	try {
		let query = [
			{
				$lookup:
				{
					from: "authors",
					localField: "author",
					foreignField: "_id",
					as: "author"
				}
			},
			{ $unwind: '$author' },
		];
		if (req.query.keyword && req.query.keyword != '') {
			query.push({
				$match: {
					$or: [
						{
							title: { $regex: req.query.keyword }
						},
						{
							'author.email': { $regex: req.query.keyword }
						}
					]
				}
			});
		}
		if (req.query.author_id) {
			query.push({
				$match: {
					created_by: mongoose.Types.ObjectId(req.query.author_id),
				}
			});
		}
		query.push(
			{
				$project: {
					"_id": 1,
					"createdAt": 1,
					"title": 1,
					"content": 1,
					"author._id": 1,
					"author.email": 1,
					"comments_count": { $size: { "$ifNull": ["$comments", []] } },
					"likes_count": { $size: { "$ifNull": ["$likes", []] } },
					"views": 1
				}
			}
		);

		let blogs = await Blog.aggregate(query);
		return res.send({
			message: 'Blog successfully fetched',
			data: {
				blogs: blogs
			}
		});
	} catch (err) {
		return res.status(400).send({
			message: err.message,
			data: err
		});
	}
}

//Getting a single post and to implement view on blog
exports.singleBlog = async (req, res) => {
	try {
		let blog_id = req.params.blog_id;

		//checking if ObjectId is valid
		if (!mongoose.Types.ObjectId.isValid(blog_id)) {
			return res.status(400).send({
				message: 'Invalid blog id',
				data: {}
			});
		}
		await Blog.findByIdAndUpdate({ _id: blog_id }, {
			$inc: { views: 1 }
		}, { new: true }
		)

		let query = [
			{
				$lookup:
				{
					from: "authors",
					localField: "author",
					foreignField: "_id",
					as: "author"
				}
			},
			{ $unwind: '$author' },

			{
				$match: {
					'_id': new mongoose.Types.ObjectId(blog_id)
				}
			},
			{
				$project: {
					"_id": 1,
					"createdAt": 1,
					"title": 1,
					"content": 1,
					"author._id": 1,
					"author.email": 1,
					"comments_count": { $size: { "$ifNull": ["$comments", []] } },
					"likes_count": { $size: { "$ifNull": ["$likes", []] } },
					"views": 1
				}
			}
		];

		let blogs = await Blog.aggregate(query);

		if (blogs.length > 0) {
			let blog = blogs[0];
			return res.status(200).send({
				message: 'Blog successfully fetched',
				data: {
					blog: blog
				}
			});
		} else {
			return res.status(400).send({
				message: 'No blog found',
				data: {}
			});
		}
	} catch (err) {
		return res.status(400).send({
			message: err.message,
			data: err
		});
	}
}

//Author creating a blog
exports.create = async (req, res) => {
      
    try{
	  	const newBlog = new Blog({
            title: req.body.title,
            content: req.body.content,
            author: req.author._id,
			coauthors: [req.author._id, req.body.coauthors] //co-author
	  	});
	  	let blogData = await newBlog.save();
		let populatedData = (await blogData.populate('author'))
        return res.status(201).send({
            message:'Blog created successfully',
            data: populatedData
        });
        
	}catch(err){
		return res.status(400).send({
	  		message:err.message,
	  		data:err
	  	});

	}
}

//like - Blog : like count
exports.like = async (req, res) => {
	let blog_id = req.params.blog_id;

	//checking if ObjectId is valid
	if(!mongoose.Types.ObjectId.isValid(blog_id)){
		return res.status(400).send({
	  		message:'Invalid blog id',
	  		data:{}
	  	});
	}
	Blog.findOne({_id:blog_id}).then(async(blog)=>{
		if(!blog){
			return res.status(400).send({
		  		message:'No blog found',
		  		data:{}
		  	});
		} else {
			let current_user = req.user; //verifying a user
			Like.findOne({
				blog_id:blog_id,
				user_id:current_user._id
			}).then(async (like) => {
				try {
					//like a blog post
					if(!like){
						let blogLikeDoc = new Like({
							blog_id:blog_id,
							user_id:current_user._id
						});
						let likeData = await blogLikeDoc.save();
						await Blog.updateOne({
							_id:blog_id
						},{
							$push:{likes : likeData._id}
						})
						return res.status(200).send({
					  		message:'Like successfully added',
					  		data:{}
					  	});

						//unlike
					} else {
						await Like.deleteOne({
							_id:like._id
						});
						await Blog.updateOne({
							_id:like.blog_id
						},{
							$pull:{likes:like._id}
						})

						return res.status(200).send({
					  		message:'Like successfully removed',
					  		data:{}
					  	});
					}
				} catch(err) {
					return res.status(400).send({
				  		message:err.message,
				  		data:err
				  	});
				}

			}).catch((err) => {
				return res.status(400).send({
			  		message:err.message,
			  		data:err
			  	});
			})

		}
	}).catch((err) => {
		return res.status(400).send({
	  		message:err.message,
	  		data:err
	  	});
	})
}

