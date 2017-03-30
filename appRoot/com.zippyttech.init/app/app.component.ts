import {Component, OnInit, ChangeDetectorRef,HostListener, DoCheck, ElementRef} from '@angular/core';
import {RestController} from "../../com.zippyttech.rest/restController";
import {RoutesRecognized, NavigationStart} from "@angular/router";
import {contentHeaders} from "../../com.zippyttech.rest/headers";
import {FormControl} from "@angular/forms";
import {componentsPublic} from "../../app-routing.module";
import {AnimationsManager} from "../../com.zippyttech.ui/animations/AnimationsManager";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";
import {AngularFire} from "angularfire2";
import {IModalConfig} from "../../com.zippyttech.services/modal/modal.types";
import {API} from "../../com.zippyttech.utils/catalog/defaultAPI";

/**
 * @Params API
 * Optional
 *      {PREFIX}_DATE_MAX_HUMAN
 *
 *
 */

var jQuery = require('jquery');
@Component({
    selector: 'app',
    templateUrl: './index.html',
    styleUrls: ['./style.css'],
    animations: AnimationsManager.getTriggers("d-fade|expand_down", 150)
})
export class AppComponent extends RestController implements OnInit,DoCheck {

    public menuType: FormControl;
    public menuItems: FormControl;

    public activeMenuId: string;


    constructor(public db: DependenciesBase, private cdRef: ChangeDetectorRef,public af: AngularFire, private el:ElementRef) {
        super(db);
        this.routerEvents();
        let url="https://cdg.zippyttech.com:8080";
        localStorage.setItem('urlAPI', url + '/api');
        localStorage.setItem('url', url);
    }

    ngOnInit(): void {
        this.db.$elements.app = this.el.nativeElement;

        this.menuType = new FormControl(null);
        this.menuItems = this.db.myglobal.menuItems;
        this.loadPublicData();

    }

    routerEvents(){
        let that = this;
        this.db.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                that.db.myglobal.navigationStart = true;
            }
            if (event instanceof RoutesRecognized) {
                that.db.myglobal.navigationStart = false;
                let componentName = event.state.root.children[0].component['name'];
                let isPublic = that.isPublic(componentName);

                if (isPublic && localStorage.getItem('bearer')) {
                    let link = ['/init/dashboard', {}];
                    if(componentName == 'TermConditionsComponent'){
                        jQuery('#termConditions').modal('show');
                    }
                    that.db.router.navigate(link);
                }
                else if (localStorage.getItem('userTemp')){
                    if(componentName!='AccountSelectComponent'){
                        if(componentName!='LoadComponent')
                            that.db.myglobal.saveUrl = event.url;
                        let link = ['/auth/accountSelect', {}];
                        that.db.router.navigate(link);
                    }
                }
                else if (!isPublic && !that.db.myglobal.dataSesion.valid ) {
                    let link: any;
                    if (localStorage.getItem('bearer')) {
                        if (componentName != 'LoadComponent') {
                            that.db.myglobal.saveUrl = event.url;
                            link = ['/init/load', {}];
                            that.db.router.navigate(link);
                        }
                    }
                    else {
                        that.db.myglobal.saveUrl = event.url;
                        link = ['/auth/login', {}];
                        that.db.router.navigate(link);
                    }
                }
                else if (that.db.myglobal.saveUrl && !isPublic) {
                    let link = [that.db.myglobal.saveUrl, {}];
                    that.db.myglobal.saveUrl = null;
                    that.db.router.navigate(link);
                }

                if (that.db.myglobal.dataSesion.valid  && that.db.myglobal.getParams('VERSION_CACHE',API.VERSION_CACHE) != localStorage.getItem('VERSION_CACHE')) {
                    if(!localStorage.getItem('userTemp'))
                    {
                        localStorage.setItem('VERSION_CACHE', that.db.myglobal.getParams('VERSION_CACHE',API.VERSION_CACHE));
                        location.reload(true);
                    }
                }
            }
        });
    }

    initModels() {//TODO: Agregar info
        // this.info = new InfoModel(this.db);
        // this.info.rules['code'].readOnly = true;
        // this.info.paramsSave.updateField = true;
    }

    ngDoCheck() {
        this.cdRef.detectChanges();
    }

    get sessionValid(){
        return this.db.myglobal.dataSesion.valid && !localStorage.getItem('userTemp');
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        //TODO:Cambiar menu
        this.db.myglobal.visualData.height = event.target.innerWidth;
    }

    public isPublic(component: string) {
        return componentsPublic.indexOf(component) > -1 ? true : false;
    }

    public validToken(): boolean {
        return localStorage.getItem('bearer') ? true : false;
    }

    logout(event:Event) {
        if(event)
            event.preventDefault();

        let successCallback = ((response: any) => {
            this.db.myglobal.dataSesionInit();
            localStorage.removeItem('bearer');
            localStorage.removeItem('userTemp');
            localStorage.removeItem('accountList');
            contentHeaders.delete('Authorization');
            this.af.auth.logout();
            this.menuItems.setValue([]);
            this.menuType.setValue(null);
            this.activeMenuId = "";
            let link = ['/auth/login', {}];
            this.db.router.navigate(link);
        }).bind(this);
        this.httputils.doPost('/logout/', null, successCallback, this.error);

    }

    public changeAccount(event:Event){
        if(event)
            event.preventDefault();

        localStorage.setItem('userTemp','true');
        let link = ['/auth/accountSelect', {}];
        this.db.router.navigate(link);
    }

    public replace(data: string): string {
        return data.replace(/;/g, ' ');
    }

    onProfile(event?: Event): void {
        if (event)
            event.preventDefault();
        let link = ['/access/user/profile', {}];
        this.db.router.navigate(link);
    }

    activeMenu(event, id) {

        this.menuItems.value.forEach((v) => {
            if (this.activeMenuId === v.key && this.activeMenuId !== id)
                v.select = false;

            if (id === v.key)
                v.select = !v.select;
        });

        if (event)
            event.preventDefault();

        if (this.activeMenuId == id) {
            this.activeMenuId = "";
        }
        else {
            this.activeMenuId = id;
        }

    }

    loadPage() {
        if (!this.menuType.value) {
            this.loadMenu();
            this.initModels();
            this.menuType.setValue({
                'list': this.db.myglobal.getParams('MENU_LIST',API.MENU_LIST) ? true : false,
                'modal': this.db.myglobal.getParams('MENU_MODAL',API.MENU_MODAL) ? true : false,
            });

            if (!this.menuType.value.list) {
                jQuery('body').addClass('no-menu');
            }
        }
    }

    loadMenu() {
        if (this.menuItems.value && this.menuItems.value.length == 0) {

            this.menuItems.value.push({
                'visible': this.db.myglobal.existsPermission(['MEN_DASHBOARD']),
                'icon': 'fa fa-dollar',
                'title': 'Dashboard',
                'routerLink': '/init/dashboard'

            });
            this.menuItems.value.push({
                'visible': this.db.myglobal.existsPermission(['MEN_USER', 'MEN_ACL', 'MEN_PERMISSION', 'MEN_ROLE', 'MEN_ACCOUNT']),
                'icon': 'fa fa-gears',
                'title': 'Acceso',
                'key': 'Acceso',
                'select': false,
                'treeview': [
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_USER']),
                        'icon': 'fa fa-user',
                        'title': 'Usuarios',
                        'routerLink': '/access/user'
                    },
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_ACL']),
                        'icon': 'fa fa-user',
                        'title': 'ACL',
                        'routerLink': '/access/acl'
                    },
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_PERMISSION']),
                        'icon': 'fa fa-user',
                        'title': 'Permisos',
                        'routerLink': '/access/permission'
                    },
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_ROLE']),
                        'icon': 'fa fa-user',
                        'title': 'Roles',
                        'routerLink': '/access/role'
                    },
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_ACCOUNT']),
                        'icon': 'fa fa-building',
                        'title': 'Cuentas',
                        'routerLink': '/access/account'
                    },
                ]
            });
            this.menuItems.value.push({
                'visible': this.db.myglobal.existsPermission(['MEN_EVENT', 'MEN_INFO', 'MEN_PARAM', 'MEN_RULE', 'MEN_NOTIFICATION','MEN_CHANNEL']),
                'icon': 'fa fa-gears',
                'title': 'Configuración',
                'key': 'Configuracion',
                'select': false,
                'treeview': [
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_CHANNEL']),
                        'icon': 'fa fa-user',
                        'title': 'Canales',
                        'routerLink': '/business/channel'
                    },
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_NOTIFICATION']),
                        'icon': 'fa fa-user',
                        'title': 'Notificaciones',
                        'routerLink': '/business/notify'
                    },
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_EVENT']),
                        'icon': 'fa fa-user',
                        'title': 'Eventos',
                        'routerLink': '/business/event'
                    },
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_INFO']),
                        'icon': 'fa fa-user',
                        'title': 'Información',
                        'routerLink': '/business/info'
                    },
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_PARAM']),
                        'icon': 'fa fa-user',
                        'title': 'Parámetros',
                        'routerLink': '/business/param'
                    },
                    {
                        'visible': this.db.myglobal.existsPermission(['MEN_RULE']),
                        'icon': 'fa fa-user',
                        'title': 'Reglas',
                        'routerLink': '/business/rule'
                    },
                ]
            });
        }
    }

    getLocalStorage(item:string){
        return localStorage.getItem(item);
    }

    menuItemsVisible(menu) {
        let data = [];
        menu.forEach(obj => {
            if (obj.visible)
                data.push(obj)
        });
        return data;
    }

    menuItemsTreeview(menu) {
        let data = [];
        let datatemp = [];
        menu.forEach(obj => {
            if (obj.treeview)
                data.push(obj);
            else
                datatemp.push(obj);
        });
        data.unshift({'icon': 'fa fa-gears', 'title': 'General', 'key': 'General', 'treeview': datatemp});
        return data;
    }

    goPage(event:Event=null, url:string) {
        if (event)
            event.preventDefault();
        let link = [url, {}];
        this.db.router.navigate(link);
    }

    loadPublicData(){
        let that = this;
        let callback=(response)=>{
            Object.assign(that.db.myglobal.publicData,response.json());
        };
        this.httputils.doGet(localStorage.getItem('url'),callback,this.error,true)
    }

    getIModalTerm(){
        let iModalTerm:IModalConfig = {
            id:'termConditions',
            size:'lg',
            header:{
                title:'Terminos y condiciones'
            }
        };
        return iModalTerm;
    }
    @HostListener('window:offline') offline() {
        this.addToast('Offline','Se a detectado un problema con el Internet, Por favor conectarse a la red','error');
    }
}
