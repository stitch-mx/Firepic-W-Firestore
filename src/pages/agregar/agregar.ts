import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

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

  constructor(public readonly afs: AngularFirestore,
     public viewCtrl: ViewController,
     public navParams: NavParams,
     public toastCtrl: ToastController) {
  }

  agregarPlatillo() {
    console.log("platillo agregado");

    this.itemsCollection = this.afs.collection<Platillo>('platillos');
    /* this.platillos = this.itemsCollection.snapshotChanges().pipe(
       map(actions => actions.map(a => {
         const data = a.payload.doc.data() as Platillo;
         const id = a.payload.doc.id;
         return { id, ...data };
       }))
     ); */

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad AgregarPage');
  }

}
