export class VisibilityData {
    constructor() {
        this.data = {};
    }
    add(keys, toEveryone, toOwner) {
        if (!Array.isArray(keys)) {
            keys = [keys];
        }
        keys.forEach(key => {
            this.data[key] = {
                toEveryone,
                toOwner
            };
        });
    }
    shouldSendToEveryone(key) {
        if (!this.data[key] || !this.data[key].toEveryone) {
            return;
        }
        return this.data[key].toEveryone();
    }
    shouldSendToOwner(key) {
        if (!this.data[key] || !this.data[key].toOwner) {
            return;
        }
        return this.data[key].toOwner();
    }
    get keys() {
        return Object.keys(this.data);
    }
}
//# sourceMappingURL=visibilityData.js.map