exports.current_user = (req, res) => {
    return res.status(200).send({
		message:'Current User data successfully fetched',
		data: req.user
	});
}

exports.current_author = (req, res) => {
    return res.status(200).send({
		message:'Current Author data successfully fetched',
		data: req.author
	});
}