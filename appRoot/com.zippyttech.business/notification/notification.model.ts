import {ModelRoot} from "../../com.zippyttech.common/modelRoot";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

export class NotificationModel extends ModelRoot{

    constructor(public db:DependenciesBase){
        super(db,'/notifications/');
        this.initModel();
    }
    modelExternal() {}
    initRules(){
        this.rules['image']={
            'type': 'image',
            'update':this.permissions.update,
            'visible':this.permissions.visible,
            'key': 'image',
            'default':this.db.pathElements.robot,
            'title': 'Imagen',
            'placeholder': 'Imagen',
        };
        this.rules['title']={
            'type': 'text',
            'update':this.permissions.update,
            'visible':this.permissions.visible,
            'search' :this.permissions.filter,
            'key': 'title',
            'title': 'Título',
            'placeholder': 'Título',
        };
        this.rules['icon']={
            'type': 'select',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [
                {'value': 'fa fa-question-circle', 'text': 'Icono 1'},
                {'value': 'fa fa-question', 'text': 'Icono 2'},
            ],
            'key': 'icon',
            'title': 'Icono',
            'placeholder': 'Seleccione un icono',
        };
        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar notificación";
        this.paramsSearch.placeholder="Ingrese notificación";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar notificación"
    }
    initRuleObject() {
        this.ruleObject.title="Notificación";
        this.ruleObject.placeholder="Ingrese notificación";
        this.ruleObject.key="notification";
        this.ruleObject.keyDisplay="notificationTitle";
        this.ruleObject.keyDisplay="notificationId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
        delete this.rulesSave.image;
    }
    initModelActions(params){
        params['delete'].message='¿ Esta seguro de eliminar la notificación: ';
        params['delete'].key = 'title';
    }

}