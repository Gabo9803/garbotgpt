from flask_login import UserMixin
from datetime import datetime
from app import db

class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    theme = db.Column(db.String(20), default='light')
    language = db.Column(db.String(10), default='es')
    chat_settings = db.relationship('ChatSettings', backref='user', uselist=False)
    chat_history = db.relationship('ChatHistory', backref='user', lazy='dynamic')
    summaries = db.relationship('ConversationSummary', backref='user', lazy='dynamic')

class ChatSettings(db.Model):
    __tablename__ = 'chat_settings'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    model = db.Column(db.String(50), default='gpt-3.5-turbo')
    temperature = db.Column(db.Float, default=0.7)
    max_tokens = db.Column(db.Integer, default=1000)
    theme_color = db.Column(db.String(7), default='#007bff')
    response_tone = db.Column(db.String(20), default='neutral')  # neutral, formal, informal, creativo, técnico
    max_context_messages = db.Column(db.Integer, default=10)

class ChatHistory(db.Model):
    __tablename__ = 'chat_history'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    file_attachment = db.Column(db.String(255))
    response_tone = db.Column(db.String(20), default='neutral')
    reactions = db.relationship('MessageReaction', backref='chat_history', lazy='dynamic')

class MessageReaction(db.Model):
    __tablename__ = 'message_reaction'
    id = db.Column(db.Integer, primary_key=True)
    chat_history_id = db.Column(db.Integer, db.ForeignKey('chat_history.id'), nullable=False)
    reaction = db.Column(db.String(50), nullable=False)
    count = db.Column(db.Integer, default=1)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class ConversationSummary(db.Model):
    __tablename__ = 'conversation_summary'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    summary = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)