export default class User {
    _firstName;
    _lastName;
    _email;
    _password;

    //#region Getters
    firstName() {
        return this._firstName;
    }

    lastName() {
        return this._lastName;
    }

    email() {
        return this._email;
    }

    password() {
        return this._password;
    }
    //#endregion Getters

    generateRendomData() {
        this._firstName = "User";
        this._lastName = "User";
        this._email = this.generateRendomEmail();
        this._password = Math.random().toString(36).slice(-8);
    }

    generateRendomEmail() {
        var chars = 'abcdefghijklmnopqrstuvwxyz123';
        var string = 'user';
        for (var ii = 0; ii < 5; ii++) {
            string += chars[Math.floor(Math.random() * chars.length)];
        }
        return (string + '@gmail.com');
    }
}
