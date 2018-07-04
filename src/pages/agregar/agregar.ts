import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

//plugins de cámara y galería
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

//plugins angularfire2

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';  
import { map } from 'rxjs/operators';
import { Platillo} from '../../commons/platillo'


@Component({
  selector: 'page-agregar',
  templateUrl: 'agregar.html',
})
export class AgregarPage {

  private itemsCollection: AngularFirestoreCollection<Platillo>;

  platillos: Observable<Platillo[]>;
  
  nombre:any;
  tipo:any;
  img:any;


  imagePreview: string = "";
  imagen64: string;
  

  constructor(public readonly afs: AngularFirestore,
     public viewCtrl: ViewController,
     public navParams: NavParams,
     public toastCtrl: ToastController,
     private camera: Camera,
     private imagePicker: ImagePicker) {
  }

  agregarPlatillo() {
    console.log("platillo agregado");

    this.itemsCollection = this.afs.collection<Platillo>('platillos');

    const id = this.afs.createId();
    
    if (this.nombre != null && this.tipo != null && this.img != null) {
      
      const plato: Platillo = { 'nombre': this.nombre, 'tipo': this.tipo, 'img': this.img }
      console.table(plato);
      this.afs.collection('platillos').doc(id).set(plato);
      this.presentToast();
      this.viewCtrl.dismiss();

    } else {
      this.presentToastError();
    }

  }

  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Platillo creado exitosamente',
      duration: 1000
    });
    toast.present();
  }

  presentToastError() {
    const toast = this.toastCtrl.create({
      message: 'Faltan campos por llenar!',
      duration: 1000
    });
    toast.present();
  }

  close(){
    this.viewCtrl.dismiss();
  }

  
  showCamera(){

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.imagePreview = 'data:image/jpeg;base64,' + imageData;
      this.imagen64 = imageData;
     }, (err) => {
      console.log("Error en cámara", JSON.stringify(err));
     });

  }

  showGalery() {

    let opciones: ImagePickerOptions = {
      quality: 50,
      outputType: 1,
      maximumImagesCount: 1
    }


    this.imagePicker.getPictures(opciones).then((results) => {
      for (var i = 0; i < results.length; i++) {
        // console.log('Image URI: ' + results[i]);
        this.imagePreview = 'data:image/jpeg;base64,' + results[i];
        this.imagen64 = results[i];

      }
    }, (err) => {

      console.log("ERROR en selector", JSON.stringify(err));
    });


  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad AgregarPage');
  }

}
