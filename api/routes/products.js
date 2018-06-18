const express = require ('express');
const router = express.Router ();
const mongoose = require ('mongoose');

const Product = require ('../models/products');

// get todos os produtos em um array
router.get ('/', (req, res, next) => {
  Product.find ()
    .select ('name price _id')
    .exec ()
    .then (docs => {
      const response = {
        count: docs.length,
        products: docs.map (doc => {
          return {
            name: doc.name,
            proce: doc.proce,
            _id: doc._id,
            request: {
              type: 'GET',
              url: `http://localhost:3000/products/${doc._id}`,
            },
            updateProduct: {
              type: 'PATCH',
              url: `http://localhost:3000/products/${doc._id}`,
              body: [
                {
                  propName: 'campo a ser mudado',
                  value: 'valor a ser mudado',
                },
              ],
            },
            deleteProduct: {
              type: 'DELETE',
              url: `http://localhost:3000/products/${doc._id}`,
            },
          };
        }),
      };
      res.status (200).json (response);
    })
    .catch (err => {
      console.log (err);
      res.status (500).json ({
        error: err,
      });
    });
});

// cria um produto com body name e price
router.post ('/', (req, res, next) => {
  const product = new Product ({
    _id: new mongoose.Types.ObjectId (),
    name: req.body.name,
    price: req.body.price,
  });

  product
    .select ()
    .save ()
    .then (result => {
      console.log (result);
      res.status (201).json ({
        message: 'Produto criado com sucesso !',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${result._id}`,
          },
        },
      });
    })
    .catch (err => {
      console.log (err);
      res.status (500).json ({
        error: err,
      });
    });
});

// get detalhes de um produto especifico por id
router.get ('/:productId', (req, res, next) => {
  Product.findById (req.params.productId)
    .select ('name price _id')
    .exec ()
    .then (doc => {
      if (doc) {
        res.status (200).json ({
          product: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products',
          },
        });
      } else {
        res.status (404).json ({
          message: 'Nenhum dado encontrado para o ID fornecido',
        });
      }
    })
    .catch (err => {
      console.log (err);
      res.status (500).json ({
        error: err,
      });
    });
});

// atualiza um produto por id
router.patch ('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update ({_id: id}, {$set: updateOps})
    .exec ()
    .then (result => {
      res.status (200).json ({
        message: 'Produto editado com sucesso!',
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${id}`,
        },
        updateProduct: {
          type: 'PATCH',
          url: `http://localhost:3000/products/${id}`,
          body: [
            {
              propName: 'campo a ser mudado',
              value: 'valor a ser mudado',
            },
          ],
          deleteProduct: {
            type: 'DELETE',
            url: `http://localhost:3000/products/${doc._id}`,
          }
        },
      });
    })
    .catch (err => {
      console.log (err);
      res.status (500).json ({
        error: err,
      });
    });
});

// delete um produto por id
router.delete ('/:productId', (req, res, next) => {
  Product.findOneAndRemove ({_id: req.params.productId})
    .exec ()
    .then (result => {
      res.status (200).json ({
        message: 'Produto deletado com sucesso!',
        request: {
          type: 'POST',
          url: `http://localhost:3000/products`,
          body: {
            name: 'String',
            price: 'Number',
          },
        },
      });
    })
    .catch (err => {
      console.log (err);
      res.status (500).json ({
        error: err,
      });
    });
});

module.exports = router;
