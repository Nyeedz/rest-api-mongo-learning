const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Product = require('../models/products')

router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then(docs => {
      console.log(docs)
      res.status(200).json(docs)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

router.post('/', (req, res, next) => {

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  })

  product
    .save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: result
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })

  res.status(201).json({
    message: 'post',
    createdProduct: product
  })
})

router.get('/:productId', (req, res, next) => {
  Product.findById(req.params.productId)
    .exec()
    .then(doc => {
      console.log(doc)
      if (doc) {
        res.status(200).json(doc)
      } else {
        res.status(404).json({
          message: 'No valid entry found for provided id'
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'updated product',
    metodo: 'patch'
  })
})

router.delete('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'deleted product',
    metodo: 'delete'
  })
})

module.exports = router