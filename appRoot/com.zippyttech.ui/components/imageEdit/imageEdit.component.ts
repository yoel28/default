import {Component, EventEmitter} from '@angular/core';
import {StaticValues} from "../../../com.zippyttech.utils/catalog/staticValues";

declare var SystemJS:any;
var moment = require('moment');

@Component({
    moduleId:module.id,
    selector: 'image-edit-view',
    templateUrl: 'index.html',
    styleUrls: [ 'style.css'],
    inputs:['params','image','default','edit'],
    outputs:['out'],
})
export class ImageEditComponent {

    public configId=moment().valueOf();
    public out:any;
    public pathElements=StaticValues.pathElements;
    public edit:boolean = true;

    public params:any={};

    public image:string="";
    public default:string="";

    constructor() {
        this.out = new EventEmitter();
    }
    ngOnInit(){

    }
    saveImage(data){
        this.out.emit(this.image);
    }
    changeImage(data=null){
        this.image=data;
    }
}