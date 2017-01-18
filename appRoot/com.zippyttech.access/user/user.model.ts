import {ModelBase} from "../../com.zippyttech.common/modelBase";
import {RoleModel} from "../role/role.model";
import {StaticValues} from "../../com.zippyttech.utils/catalog/staticValues";
import {DependenciesBase} from "../../com.zippyttech.common/DependenciesBase";

export class UserModel extends ModelBase{
    private role:any;
    public pathElements=StaticValues.pathElements;

    constructor(public db:DependenciesBase){
        super(db,'USER','/users/');
        this.initModel(false);
        this.loadDataExternal();
    }
    modelExternal() {
        this.role= new RoleModel(this.db);
    }
    initRules(){

        this.rules['id']={
            'type': 'number',
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'id',
            'title': 'ID',
            'placeholder': 'ID',
        };

        this.rules['idCard']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'idCard',
            'title': 'Cédula',
            'placeholder': 'Cédula',
        };
        this.rules['name']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'name',
            'title': 'Nombre',
            'placeholder': 'Nombre',
        };
        this.rules['email']={
            'type': 'text',
            'email':true,
            'required':true,
            'setEqual':'username',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'email',
            'title': 'Correo electronico',
            'placeholder': 'Correo electronico',
        };
        this.rules['phone']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'phone',
            'title': 'Teléfono',
            'placeholder': 'Teléfono',
        };

        this.rules['address']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'address',
            'title': 'Dirección',
            'placeholder': 'Dirección',
        };

        this.rules['password']={
            'type': 'password',
            'required':true,
            'update':this.permissions.update,
            'visible':this.permissions.visible,
            'key': 'password',
            'showbuttons':true,
            'title': 'Contraseña',
            'placeholder': 'Contraseña',
        };

        this.rules['image']={
            'type': 'image',
            'update':this.permissions.update,
            'visible':this.permissions.visible,
            'key': 'image',
            'default':this.db.pathElements.robot,
            'title': 'Imagen',
            'placeholder': 'Imagen',
        };
        this.rules["accountLocked"] = {
            'update':this.permissions.update,
            'visible':this.permissions.visible,
            'search':this.permissions.filter,
            'icon': 'fa fa-list',
            "type": "boolean",
            'source': [
                {'value':false,'text': 'Verificado', 'class': 'btn btn-sm btn-green'},
                {'value':true, 'text': 'Sin verificar', 'class': 'btn btn-sm btn-red'},
            ],
            "key": "accountLocked",
            "title": "Cuenta",
            "placeholder": "¿Cuenta verificada?",
        };

        this.rules['roles']=this.role.ruleObject;
        this.rules['roles'].type= 'checklist';
        this.rules['roles'].mode= 'popup';
        this.rules['roles'].showbuttons=true;
        this.rules['roles'].source=[];
        this.rules['roles'].search=false;




        this.rules = Object.assign({},this.rules,this.getRulesDefault());
        delete this.rules['detail'];
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar usuario";
        this.paramsSearch.placeholder="Ingrese el usuario";
        this.paramsSearch.label.title="Alias: ";
        this.paramsSearch.label.detail=""
    }
    initParamsSave() {
        this.paramsSave.title="Agregar usuario"
    }
    initRuleObject() {
        this.ruleObject.title="Usuario";
        this.ruleObject.placeholder="Ingrese el usuario";
        this.ruleObject.key="user";
        this.ruleObject.keyDisplay="userEmail";
        this.ruleObject.code="userId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.id;
        delete this.rulesSave.roles;
        delete this.rulesSave.enabled;
        delete this.rulesSave.image;
        delete this.rulesSave.accountLocked;
        delete this.rulesSave.username;
    }
    loadDataExternal()
    {
        let that = this;
        this.role.loadData().then(response => {
            if(that.role.dataList && that.role.dataList.list)
            {
                that.role.dataList.list.forEach(obj=> {
                    that.rules['roles'].source.push({'value': obj.id, 'text': obj.authority});
                });
            }
            that.completed = true;
        })
    }

}