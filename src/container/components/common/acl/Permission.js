
import { isArray } from 'lodash';

export default class Permission {
    checkPermission = (permission, string) => {
        //let result = false;
        if (isArray(permission)) {
            permission.forEach((v) => {
                if (`${v.controller}-${v.action}` === string) {
                    //result = true;
                }
            });
        }
        return true;
    }
}
