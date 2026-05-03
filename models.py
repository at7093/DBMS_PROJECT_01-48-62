from flask_sqlalchemy import SQLAlchemy
from enum import Enum
import datetime

db = SQLAlchemy()

class Role(Enum):
    BUSINESS_OWNER = 'BUSINESS_OWNER'
    CUSTOMER = 'CUSTOMER'
    DELIVERY_AGENT = 'DELIVERY_AGENT'

class TransactionStatus(Enum):
    PENDING = 'PENDING'
    FUNDS_HELD_BY_MEDIATOR = 'FUNDS_HELD_BY_MEDIATOR'
    IN_TRANSIT = 'IN_TRANSIT'
    TRANSACTION_COMPLETE = 'TRANSACTION_COMPLETE'
    RETURN_IN_PROGRESS = 'RETURN_IN_PROGRESS'
    REFUNDED = 'REFUNDED'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.Enum(Role), nullable=False)
    balance = db.Column(db.Float, default=0.0) # To simulate holding funds
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role.value,
            'balance': self.balance
        }

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    owner = db.relationship('User', backref=db.backref('products', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'owner_id': self.owner_id,
            'owner_username': self.owner.username
        }

class EscrowTransaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    product = db.relationship('Product')
    
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    customer = db.relationship('User', foreign_keys=[customer_id])
    
    delivery_agent_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    delivery_agent = db.relationship('User', foreign_keys=[delivery_agent_id])
    
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.Enum(TransactionStatus), default=TransactionStatus.PENDING)
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product_name': self.product.name,
            'customer_id': self.customer_id,
            'customer_username': self.customer.username,
            'delivery_agent_id': self.delivery_agent_id,
            'delivery_agent_username': self.delivery_agent.username if self.delivery_agent else None,
            'amount': self.amount,
            'status': self.status.value,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'owner_id': self.product.owner_id
        }
