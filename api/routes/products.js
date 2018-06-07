const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Product = require('../models/products')

// get todos os produtos em um array
router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then(docs => {
      console.log(docs)
      // if (docs.length >= 0) {
      res.status(200).json(docs)
      // } else {
      //   res.status(404).json({
      //     message: 'Nenhum dado encontrado'
      //   })
      // }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

// cria um produto com body name e price
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
        message: "Produto criado com sucesso !",
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
    message: 'Produto criado com sucesso !',
    createdProduct: product
  })
})

// get detalhes de um produto especifico por id
router.get('/:productId', (req, res, next) => {
  Product.findById(req.params.productId)
    .exec()
    .then(doc => {
      console.log(doc)
      if (doc) {
        res.status(200).json(doc)
      } else {
        res.status(404).json({
          message: 'Nenhum dado encontrado para o ID fornecido'
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

// atualiza um produto por id
router.patch('/:productId', (req, res, next) => {
  const updateOps = {}
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  Product.update({ _id: req.params.productId }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json({
        message: 'Produto atualizado com sucesso!',
        result: result
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

// delete um produto por id
router.delete('/:productId', (req, res, next) => {
  Product.findOneAndRemove({ _id: req.params.productId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Produto deletado com sucesso!',
        result: result
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

module.exports = router