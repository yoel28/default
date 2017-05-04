import {ModelBase} from '../../com.zippyttech.common/modelBase';
import {DependenciesBase} from '../../com.zippyttech.common/DependenciesBase';
import {TextRule} from '../../com.zippyttech.common/rules/text.rule';
import {TextareaRule} from '../../com.zippyttech.common/rules/textarea.rule';
import {SelectRule} from '../../com.zippyttech.common/rules/select.rule';
import {IView} from '../../com.zippyttech.common/modelRoot';

export class ParamModel extends ModelBase {

    constructor(public db: DependenciesBase) {
        super(db, '/params/');
        this.initModel();
    }

    initView(params: IView) {
    }

    initModelExternal() {
    }

    initModelActions() {
    }

    initPermissions() {
    }

    initDataActions() {
    }

    initDataExternal() {
    };

    initRules() {

        this.rules['code'] = new TextRule({
            required: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            }
        });

        this.rules['value'] = new TextareaRule({
            exclude: true,
            required: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            }
        });

        this.rules['type'] = new SelectRule({
            required: true,
            permissions: {
                update: this.permissions.update,
                search: this.permissions.filter,
                visible: this.permissions.visible,
            },
            source: [
                {value: 'string', text: 'String'},
                {value: 'object', text: 'Object'},
                {value: 'number', text: 'Number'},
                {value: 'datetime', text: 'Datetime'},
                {value: 'date', text: 'Date'},
                {value: 'boolean', text: 'Boolean'},

            ]
        });

        this.globalOptional();

        this.rules = Object.assign({}, this.rules, this.getRulesDefault());

    }

}
