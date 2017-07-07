  var _ = require('lodash');
  var mongoose = require('mongoose'); // requiring the Mongoose driver...
  var Product = require('../product/product.model');

  exports.percentoff = function(req, res) {
  if(req.body._id) { delete req.body._id; }
   req.body.uid = req.user.email; // id change on every login hence email is used
    req.body.updated = Date.now();
    if(req.body.name)
      req.body.nameLower = req.body.name.toString().toLowerCase();
    if(!req.body.slug && req.body.name)
      req.body.slug = req.body.name.toString().toLowerCase()
                        .replace(/\s+/g, '-')        // Replace spaces with -
                        .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
                        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
                        .replace(/^-+/, '')          // Trim - from start of text
                        .replace(/-+$/, '');
    Product.findById(req.params.id, function (err, product) {
      if (err) { return handleError(res, err); }
      if(!product) {
       return res.status(404).send('Not Found'); 
     } else {
      product.variants = req.body.variants;
      product.features = req.body.features;
      product.keyFeatures = req.body.keyFeatures;
      var percentoff = parseInt(req.body.discount.percentOff, 10); //converting offset string into number...
      if(isNaN(percentoff) || percentoff < 0 || percentoff > 100){
        res.status(200).json({ "message" : "If suplied in querystring count and offset should be numbers" });
          } else {
            product.discount.buy.number = null;
            product.discount.buy.getfree = null;
            product.discount.rsOff = null;
            var price;
            product.discount.percentOff = percentoff;
            var length = product.variants.length;
            for(var i = 0 ; i < length ; i++)
            {
              price = product.variants[i].mrp;
              product.variants[i].price = price - ((percentoff/100)*price);
            }
               product.markModified('variants')
             
              // console.log(product.variants[0].price);
              // price = product.variants[0].mrp;
              // product.variants[0].price = price - ((percentoff/100)*price);
              // product.markModified('variants.0.price');
              // console.log(product.variants[0].price);
            
              // price = product.variants[1].mrp;
              // product.variants[1].price = price - ((percentoff/100)*price);
              // product.markModified('variants.1.price');
              // console.log(product.variants[1].price);
              //console.log(product);
            // price = product.variants[0].mrp;
            // product.discount.percentOff = percentoff;
            // product.variants[0].price = price - ((percentoff/100)*price);
            // product.markModified('variants.0.price');
            // product.save(function(err) {
            //   if (err) return validationError(res, err);
            //   res.status(200).json(product);
            //    console.log(product);
            // });
           var updated = _.extend(product, product);
            updated.save(function (err) {
              if (err) { return handleError(res, err); }
              console.log(product);
              return res.status(200).json(product);
            });
          }
        }
        });
      }



  exports.rsoff = function(req, res) {
  if(req.body._id) { delete req.body._id; }
   req.body.uid = req.user.email; // id change on every login hence email is used
    req.body.updated = Date.now();
    if(req.body.name)
      req.body.nameLower = req.body.name.toString().toLowerCase();
    if(!req.body.slug && req.body.name)
      req.body.slug = req.body.name.toString().toLowerCase()
                        .replace(/\s+/g, '-')        // Replace spaces with -
                        .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
                        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
                        .replace(/^-+/, '')          // Trim - from start of text
                        .replace(/-+$/, '');
    Product.findById(req.params.id, function (err, product) {
      if (err) { return handleError(res, err); }
      if(!product) { return res.status(404).send('Not Found'); }
      product.variants = req.body.variants;
      product.features = req.body.features;
      product.keyFeatures = req.body.keyFeatures;
      var rsoff = parseInt(req.body.discount.rsOff, 10); //converting offset string into number...
      if(isNaN(rsoff) || rsoff < 0 || rsoff > product.variants.mrp){
        res.status(400).json({ "message" : "If suplied in querystring count and offset should be numbers" });
          } else {
            product.discount.buy.number = null;
            product.discount.buy.getfree = null;
            product.discount.percentOff = null;
            var price;
            var length = product.variants.length;
            product.discount.rsOff = rsoff;
            for(var i = 0 ; i < length ; i++)
            {
              price = product.variants[i].mrp;
              product.variants[i].price = price - rsoff;
            }
            product.markModified('variants');
            var updated = _.extend(product, product);
            updated.save(function (err) {
              if (err) { return handleError(res, err); }
              console.log(product);
              return res.status(200).json(product);
            });
          }
        });
      }



  exports.buyDiscount = function(req, res) {
  if(req.body._id) { delete req.body._id; }
   req.body.uid = req.user.email; // id change on every login hence email is used
    req.body.updated = Date.now();
    if(req.body.name)
      req.body.nameLower = req.body.name.toString().toLowerCase();
    if(!req.body.slug && req.body.name)
      req.body.slug = req.body.name.toString().toLowerCase()
                        .replace(/\s+/g, '-')        // Replace spaces with -
                        .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
                        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
                        .replace(/^-+/, '')          // Trim - from start of text
                        .replace(/-+$/, '');
    Product.findById(req.params.id, function (err, product) {
      if (err) { return handleError(res, err); }
      if(!product) { return res.status(404).send('Not Found'); }
      product.variants = req.body.variants;
      product.features = req.body.features;
      product.keyFeatures = req.body.keyFeatures;

      product.discount.percentOff = null;
      product.discount.rsOff = null;
      product.discount.buy.number = parseInt(req.body.discount.buy.number, 10);
      product.discount.buy.getfree = parseInt(req.body.discount.buy.getfree, 10);


      var length = product.variants.length;
          for(var i = 0 ; i < length ; i++)
          {
            product.variants[i].price = product.variants[i].mrp;
          }
             product.markModified('variants');

            var updated = _.extend(product, product);
            updated.save(function (err) {
              if (err) { return handleError(res, err); }
              console.log(product);
              return res.status(200).json(product);
            });
        });
      }

  //     exports.buyTwo = function(req, res) {
  // if(req.body._id) { delete req.body._id; }
  //  req.body.uid = req.user.email; // id change on every login hence email is used
  //   req.body.updated = Date.now();
  //   if(req.body.name)
  //     req.body.nameLower = req.body.name.toString().toLowerCase();
  //   if(!req.body.slug && req.body.name)
  //     req.body.slug = req.body.name.toString().toLowerCase()
  //                       .replace(/\s+/g, '-')        // Replace spaces with -
  //                       .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
  //                       .replace(/\-\-+/g, '-')      // Replace multiple - with single -
  //                       .replace(/^-+/, '')          // Trim - from start of text
  //                       .replace(/-+$/, '');
  //   Product.findById(req.params.id, function (err, product) {
  //     if (err) { return handleError(res, err); }
  //     if(!product) { return res.status(404).send('Not Found'); }
  //     product.variants = req.body.variants;
  //     product.features = req.body.features;
  //     product.keyFeatures = req.body.keyFeatures;

  //     product.discount.percentOff = null;
  //     product.discount.rsOff = null;
  //     product.discount.buyOne = null;
  //     product.discount.buyTwo = parseInt(req.body.discount.buyTwo, 10);
      
  //     var length = product.variants.length;
  //         for(var i = 0 ; i < length ; i++)
  //         {
  //           product.variants[i].price = product.variants[i].mrp;
  //         }
  //            product.markModified('variants');
  //           var updated = _.extend(product, product);
  //           updated.save(function (err) {
  //             if (err) { return handleError(res, err); }
  //             console.log(product);
  //             return res.status(200).json(product);
  //           });
  //       });
  //     }


      function handleError(res, err) {
        return res.status(500).send(err);
       }

