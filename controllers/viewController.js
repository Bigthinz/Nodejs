exports.getOverview = (req, res, next) => {

    res.status(200).render('overview', { title: 'All tour', user: 'king' })
}


exports.getOverview = (req, res, next) => {

    res.status(200).render('overview', { title: 'All tour', user: 'king' })
}


exports.getTour = (req, res, next) => {

    res.status(200).render('tour', { title: 'The forest Hiker', user: 'king' })
}