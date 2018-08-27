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
import { Platillo} from '../../commons/platillo';
import { storage } from 'firebase';

//Provider para carga de archivos
import { CargarImagenProvider } from '../../providers/cargar-imagen/cargar-imagen';

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
     private imagePicker: ImagePicker,
     public cargarImagen: CargarImagenProvider) {
  }

  agregarPlatillo() {
    console.log("platillo agregado");

    this.itemsCollection = this.afs.collection<Platillo>('platillos');

    const id = this.afs.createId();
    
    if (this.nombre != null && this.tipo != null ) {

     
      
      const plato: Platillo = { 'nombre': this.nombre, 'tipo': this.tipo } //'img': this.img 
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

  
  async showCamera(){
    try {

      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }

     
  
      const result = await this.camera.getPicture(options);
      //this.imagePreview = result;
      const image = `data:image/jpeg;base64, ${result}`;
      const pictures = storage().ref('platillos/platilloNum');
      pictures.putString(image, 'data_url');
      //this.img = pictures;
      console.log("imagen subida correctamente!");
     
         
    } catch (error) {
      
    }
    

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
