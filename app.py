from flask import Flask, request

from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from flask.json import jsonify, dumps

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///boilerplate.db'
db = SQLAlchemy(app)

from sqlalchemy.inspection import inspect

class Serializer(object):
    def serialize(self):
        return {c: getattr(self, c) for c in inspect(self).attrs.keys()}
    @staticmethod
    def serialize_list(l):
        return [m.serialize() for m in l]
    
class User(db.Model, Serializer):
    id = db.Column(db.Integer, primary_key =True)
    name = db.Column(db.String(100), nullable = False)
    email = db.Column(db.String(100), nullable= False)
    mobileNumber = db.Column(db.String(8), nullable = False)
    
@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/', methods=["GET", "POST"])
def index():
    if request.method=="GET":
        param_name = request.args.get("name")
        status_code = 200
        data = User.query.filter_by(name=param_name).first()
        if data==[] or data is None:
            return {"message": "User doesn't exist"}, 404
        data = dumps(data.serialize())
        return data, status_code
        
    else:
        content = request.get_json()
        user = User(name = content["name"], email = content["email"], mobileNumber = content["mobileNumber"])
        db.session.add(user)
        db.session.commit()
        status_code = 200
        data = {"message": f"Hi {content['name']}, thanks for registering!"}
        return data, status_code

if __name__=='__main__':
	app.run(debug=True)