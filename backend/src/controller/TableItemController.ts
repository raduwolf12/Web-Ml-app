import {Any, getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {TableItem} from "../entity/TableItem";
import *  as tf from "@tensorflow/tfjs";
import {MnistData} from "../data/Data";
import { Tensor } from "@tensorflow/tfjs";

export class TableItemController {

    private tabelItemRepository = getRepository(TableItem);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.tabelItemRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.tabelItemRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.tabelItemRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let itemToRemove = await this.tabelItemRepository.findOne(request.params.id);
        await this.tabelItemRepository.remove(itemToRemove);
    }
    async eval(request: Request, response: Response, next: NextFunction) {
        console.log('eval')
        const data  = new MnistData()
        const model = await tf.loadLayersModel('file://mnist_model/new/model.json');
        console.log(request.files.img)
         await data.load1(request.files.img.data);
         const pred = doPrediction(model, data, 1);
         console.log(pred[0].print())
         const img = new TableItem()
         img.imageName = "img"
         console.log("name")
         img.size = 28*28
         console.log("shape")
         img.recognitionResult = pred[0].toString()
         console.log("res")
         img.downloadLink = "data:image/png;base64,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"
         console.log('link', img.recognitionResult)
         this.tabelItemRepository.save(img)
         return pred
    }


    async train(request: Request, response: Response, next: NextFunction) {
        console.log('train')

        const data = new MnistData();
        await data.load();
        const model = getModel();
        await trainModel(model, data);
        await model.save('file://mnist_model/new')
        return 'train was completed'
    }


    
}

function doPrediction(model, data, testDataSize = 500) {
    const IMAGE_WIDTH = 28;
    const IMAGE_HEIGHT = 28;
    const testData = data.nextTestBatch(testDataSize);
    const testxs = testData.xs.reshape([testDataSize, IMAGE_WIDTH, IMAGE_HEIGHT, 1]);
    const labels = testData.labels.argMax(-1);
    const preds = model.predict(testxs).argMax(-1)
    
    testxs.dispose();
    preds.print()
  
    return [preds, labels];
  } 


  function getModel() {
    const model = tf.sequential();
    
    const IMAGE_WIDTH = 28;
    const IMAGE_HEIGHT = 28;
    const IMAGE_CHANNELS = 1;  
    
    // In the first layer of our convolutional neural network we have 
    // to specify the input shape. Then we specify some parameters for 
    // the convolution operation that takes place in this layer.
    model.add(tf.layers.conv2d({
      inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
    }));
  
    // The MaxPooling layer acts as a sort of downsampling using max values
    // in a region instead of averaging.  
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
    
    // Repeat another conv2d + maxPooling stack. 
    // Note that we have more filters in the convolution.
    model.add(tf.layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
    
    // Now we flatten the output from the 2D filters into a 1D vector to prepare
    // it for input into our last layer. This is common practice when feeding
    // higher dimensional data to a final classification output layer.
    model.add(tf.layers.flatten());
  
    // Our last layer is a dense layer which has 10 output units, one for each
    // output class (i.e. 0, 1, 2, 3, 4, 5, 6, 7, 8, 9).
    const NUM_OUTPUT_CLASSES = 10;
    model.add(tf.layers.dense({
      units: NUM_OUTPUT_CLASSES,
      kernelInitializer: 'varianceScaling',
      activation: 'softmax'
    }));
  
    
    // Choose an optimizer, loss function and accuracy metric,
    // then compile and return the model
    const optimizer = tf.train.adam();
    model.compile({
      optimizer: optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });
  
    return model;
  }
  async function trainModel(model, data) {
    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    const container = {
      name: 'Model Training', tab: 'Model', styles: { height: '1000px' }
    };
    // const fitCallbacks = tf.show.fitCallbacks(container, metrics);
    
    const BATCH_SIZE = 512;
    const TRAIN_DATA_SIZE = 5500;
    const TEST_DATA_SIZE = 1000;
  
    const [trainXs, trainYs] = tf.tidy(() => {
      const d = data.nextTrainBatch(TRAIN_DATA_SIZE);
      return [
        d.xs.reshape([TRAIN_DATA_SIZE, 28, 28, 1]),
        d.labels
      ];
    });
  
    const [testXs, testYs] = tf.tidy(() => {
      const d = data.nextTestBatch(TEST_DATA_SIZE);
      return [
        d.xs.reshape([TEST_DATA_SIZE, 28, 28, 1]),
        d.labels
      ];
    });
  
    return model.fit(trainXs, trainYs, {
      batchSize: BATCH_SIZE,
      validationData: [testXs, testYs],
      epochs: 10,
      shuffle: true,
    //   callbacks: fitCallbacks
    });
  }
//   async function showAccuracy(model,data) {
//     const [preds, labels] = doPrediction(model,data);
//     const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
//     const container = { name: 'Accuracy', tab: 'Evaluation' };
//     tfvis.show.perClassAccuracy(container, classAccuracy, classNames);

  
//     labels.dispose();
//   }