export class SerializationUtils {

    static stringify(object) {
        return JSON.stringify(object, this.replaceParentWithUndefined, 2)
    }

    private static replaceParentWithUndefined(key,value) {
        if (key=="parent") return undefined;
        else return value;
    }

}