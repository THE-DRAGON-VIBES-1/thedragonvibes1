import os
import csv
import re
import logging
from datetime import datetime
from flask import Flask, render_template, request, redirect, flash

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")

def validar_email(email):
    """Validate email format using regex"""
    return re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email)

def validar_telefone(telefone):
    """Validate phone number format - accepts international formats"""
    return re.match(r'^\+?[\d\s\-\(\)]{7,}$', telefone)

def validar_nome(nome):
    """Validate name - should not be empty and contain only letters and spaces"""
    return nome and len(nome.strip()) >= 2 and re.match(r'^[A-Za-zÀ-ÿ\s]+$', nome.strip())

def criar_csv_se_nao_existir():
    """Create CSV file with headers if it doesn't exist"""
    if not os.path.exists("contatos.csv"):
        with open("contatos.csv", "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["Nome", "Email", "Telefone", "Interesse", "Data/Hora"])

@app.route("/", methods=["GET", "POST"])
def index():
    """Main contact form route"""
    if request.method == "POST":
        # Get form data
        nome = request.form.get("nome", "").strip()
        email = request.form.get("email", "").strip()
        telefone = request.form.get("telefone", "").strip()
        interesse_list = request.form.getlist("interesse")
        interesse = ", ".join(interesse_list) if interesse_list else ""
        
        # Validation
        errors = []
        
        if not validar_nome(nome):
            errors.append("Nome deve conter pelo menos 2 caracteres e apenas letras.")
        
        if not validar_email(email):
            errors.append("Email deve ter um formato válido (ex: usuario@dominio.com).")
        
        if not validar_telefone(telefone):
            errors.append("Telefone deve ter um formato válido (ex: +244 932 998 220 ou (11) 99999-9999).")
        
        if not interesse_list:
            errors.append("Por favor, selecione pelo menos um serviço de interesse.")
        
        # If there are validation errors, show them
        if errors:
            for error in errors:
                flash(error, 'danger')
            return render_template("index.html", 
                                 nome=nome, 
                                 email=email, 
                                 telefone=telefone, 
                                 interesse_list=interesse_list)
        
        # If validation passes, save to CSV
        try:
            criar_csv_se_nao_existir()
            horario = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            
            with open("contatos.csv", "a", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow([nome, email, telefone, interesse, horario])
            
            app.logger.info(f"Contact saved: {nome} - {email}")
            flash("Contato salvo com sucesso!", 'success')
            return redirect("/obrigado")
            
        except Exception as e:
            app.logger.error(f"Error saving contact: {str(e)}")
            flash("Erro interno. Tente novamente mais tarde.", 'danger')
            return render_template("index.html", 
                                 nome=nome, 
                                 email=email, 
                                 telefone=telefone, 
                                 interesse_list=interesse_list)
    
    return render_template("index.html")

@app.route("/obrigado")
def obrigado():
    """Thank you page after successful form submission"""
    return render_template("obrigado.html")

@app.route("/contatos")
def listar_contatos():
    """Admin route to view all contacts (for testing purposes)"""
    try:
        contatos = []
        if os.path.exists("contatos.csv"):
            with open("contatos.csv", "r", encoding="utf-8") as f:
                reader = csv.reader(f)
                contatos = list(reader)
        return render_template("contatos.html", contatos=contatos)
    except Exception as e:
        app.logger.error(f"Error reading contacts: {str(e)}")
        return f"Erro ao ler contatos: {str(e)}", 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
