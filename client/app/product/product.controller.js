'use strict';

angular.module('shopnxApp')
  .controller('ProductCtrl', function ($scope, socket, Product, Category, Brand, Feature, Modal, toastr, $http) {
    var cols = [
      {heading:'sku',dataType:'text', sortType:'lowercase'},
      {heading:'name',dataType:'text', sortType:'lowercase'},
      {heading:'info',dataType:'text', sortType:'lowercase'}
    ];


    // $scope.discounts = ["Percent Discount", "Buy 1 Get", "Buy 2 Get", "Rs.Off"];
     

    // var cols = ['sku','name','nameLower','slug','status','info','uid', 'active','img'];
    $scope.products = [];
    $scope.product = {};
    $scope.variant = {};
    $scope.newFeature = {};
    $scope.newKF = {};
    $scope.product.variants = [];
    $scope.product.features = [];
    $scope.product.keyFeatures = [];
    // $scope.selected = {};
    // $scope.selected.feature = [];
    $scope.features = Feature.query();
    //console.log($scope.features);
    // $scope.items=$scope.features.map(function(name){ return { key:key,val:val}; })
    // $scope.selected.feature[0] = {"key":"Fit","val":"Tight"};
    $scope.products = Product.query({}, function() {
      socket.syncUpdates('product', $scope.products);
    });
    console.log($scope.products);


    $scope.categories = Category.query(function() {
      socket.syncUpdates('category', $scope.categories);
    });
    $scope.brands = Brand.query(function() {
      socket.syncUpdates('brand', $scope.brands);
    });

    $scope.edit = function(product) {
      var title; if(product.name){ title = 'Editing ' + product.name;} else{ title = 'Add New';}
      Modal.show(product,{title:title, api:'Product', columns: cols});
    };


    $scope.save = function(product, $http){

      if('variants' in $scope.product){
      }else{
          $scope.product.variants = [];
      }
      if('keyFeatures' in $scope.product){
      }else{
          $scope.product.keyFeatures = [];
      }
      if('features' in $scope.product){
      }else{
          $scope.product.features = [];
      }

      if('size' in $scope.variant){
        $scope.product.variants.push($scope.variant);
        // console.log($scope.product.variants);
      }
      // console.log($scope.newKF);
      if('val' in $scope.newKF){
        $scope.product.keyFeatures.push($scope.newKF.val);
        console.log($scope.product.keyFeatures);
      }
      if('key' in $scope.newFeature){
        $scope.product.features.push($scope.newFeature);
        // console.log($scope.product.features);
      }
      $scope.variant = {};
      $scope.newKF = {};
      $scope.newFeature = {};

      // $scope.feature.key = feature.key.name;
      // $scope.product.feature = $scope.selected.feature;

      // console.log($scope.selected.feature);
      if('_id' in product){
         if((product.discount.percentOff != 0) && (product.discount.percentOff != null) ) {
              if((product.discount.percentOff < 0) || (product.discount.percentOff > 100)) {
                  toastr.error("Please make sure Discount Percentage should be between 0 to 100 %.");
          } else {
             Product.percentOff.update({ id:$scope.product._id }, $scope.product).$promise.then(function() {
                  toastr.success("Product info saved with Percent discount successfully","Success");
                }, function(error) { // error handler
                  var err = error.data.errors;
                  toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
                });
          }

       } else if ((product.discount.rsOff != 0) && (product.discount.rsOff != null)) {
          if((product.discount.rsOff < 0) || (product.discount.rsOff > product.variants.mrp)) {
                  toastr.error("Please make sure Discount Amount should be lessthan mrp");
             } else {
              console.log(product.variants.mrp);
            Product.rsOff.update({ id:$scope.product._id }, $scope.product).$promise.then(function() {
              toastr.success("Product info saved with Rs. discount successfully","Success");
            }, function(error) { // error handler
              var err = error.data.errors;
              toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
            });
          }
       }  else if ((product.discount.buy.number != 0) && (product.discount.buy.number != null) && (product.discount.buy.getfree != 0) && (product.discount.buy.getfree != null)) {
          if((product.discount.buy.number < 0) || (product.discount.buy.number > 4) || (product.discount.buy.getfree < 0) || (product.discount.buy.getfree > 4)) {
                  toastr.error("Please make sure Discount Buy One Get free should be lessthan 4 Quantity");
             } else {
            Product.buyDiscount.update({ id:$scope.product._id }, $scope.product).$promise.then(function() {
              toastr.success("Product info saved with Buy and get free discount successfully","Success");
            }, function(error) { // error handler
              var err = error.data.errors;
              toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
            });
          } 
        } 
        // else if((product.discount.buy.number != 0) && (product.discount.buy.getfree == null)) {
        //           toastr.error("Please make sure ");

        // }

       // else if(((product.discount.buy.number != 0) && (product.discount.buy.getfree == null)) || ((product.discount.buy.number != 0) && (product.discount.buy.getfree == 0)) || ((product.discount.buy.number == 0) && (product.discount.buy.getfree != 0)) || ((product.discount.buy.number == null) && (product.discount.buy.getfree != 0))){
       //          console.log(((product.discount.buy.number != 0 && product.discount.buy.number == null ) && (product.discount.buy.getfree != 0 && product.discount.buy.getfree == null)));
       //          toastr.error("Please make sure field Discount Buy properly added!");
       // } 
       else if((product.discount.percentOff == null) && (product.discount.rsOff == null) && (product.discount.buy.number == null) && (product.discount.buy.getfree == null)) {
          Product.update({ id:$scope.product._id }, $scope.product).$promise.then(function() {
            toastr.success("Product info saved successfully","Success");
          }, function(error) { // error handler
            var err = error.data.errors;
            toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
          });
      } else {
            toastr.error("Please add the Discount properly! ");
      } 
        }

    };

    $scope.changeActive = function(b){ // success handler
      b.active = !b.active;
      Product.update({ id:b._id }, b).$promise.then(function() {

      }, function(error) { // error handler
          // console.log(error);
          toastr.error(error.statusText + ' (' +  error.status + ')');
          b.active = !b.active;
      });
    };

    $scope.deleteFeature = function(index,product) {
      $scope.product.features.splice(index, 1);
      $scope.save(product)
    };

    $scope.deleteKF = function(index,product) {
      $scope.product.keyFeatures.splice(index, 1);
      $scope.save(product)
    };

    $scope.deleteVariants = function(index,product) {
      $scope.product.variants.splice(index, 1);
      $scope.save(product)
    };

    $scope.productDetail = function(product){
        if(product){ $scope.product = product; }
        else{ $scope.product = {}; }
    };

    $scope.deleteAllDiscount = function(index,product) {
      product.discount.rsOff = null;
      product.discount.percentOff = null;
      product.discount.buy.number = null;
      product.discount.buy.getfree = null;
      $scope.save(product)
    };

  });
