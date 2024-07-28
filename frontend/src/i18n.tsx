import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "Welcome": "Welcome",
            "Create": "Create",
            "Commands": "Commands",
            "Logout": "Logout",
            "Al morakochi": "Al morakochi",
            "Client": "Client",
            "Address": "Address",
            "Product": "Product",
            "Price": "Price",
            "Quantity": "Quantity",
            "Total": "Total",
            "Remain": "Remain",
            "Status": "Status",
            "Date": "Date",
            "Actions": "Actions",
            "Amount": "Amount",
            "Paid": "Paid",
            "Not Paid": "Not Paid",
            "Modify": "Modify",
            "Delete": "Delete",
            "Create New Command": "Create New Command",
            "Command Owner": "Command Owner",
            "Client Address": "Client Address",
            "Product Name": "Product Name",
            "Quantity is required": "Quantity is required",
            "Price per Unit": "Price per Unit",
            "Paid Amount": "Paid Amount",
            "Add Command": "Add Command",
            "Command added successfully!": "Command added successfully!",
            "languages": "Languages",
            "More": "More",
            "Close": "Close",
            "Users": "Users",
            "Username": "Username",
            "Password": "Password",
            "Role": "Role",
            "Enter Username": "Enter Username",
            "Enter Password": "Enter Password",
            "Login": "Login",
            "Search by client name...": "Search by client name...",
            "Add User": "Add User",
            "Cancel": "Cancel",
            "Save": "Save",
            "Modify Command": "Modify Command",
        }
    },
    ar: {
        translation: {
            "Welcome": "مرحبا",
            "Create": "اشتر",
            "Commands": "قائمة المشتريات",
            "Logout": "تسجيل خروج",
            "Al morakochi": "المراكشي",
            "Client": "زبون",
            "Address": "عنوان",
            "Product": "منتج",
            "Price": "الثمن",
            "Quantity": "العدد",
            "Total": "المجموع",
            "Remain": "المبلغ المتبقي",
            "Status": "الحالة",
            "Date": "التاريخ",
            "Actions": "الإجراءات",
            "Amount": "السعر المدفوع",
            "paid": "تم الدفع",
            "not paid": "لم يتم الدفع",
            "Modify": "تعديل",
            "Delete": "حذف",
            "Create New Command": "أنشاء طلبية جديدة",
            "Command Owner": "زبون",
            "Client Address": "عنوان زبون",
            "Product Name": "اسم المنتج",
            "Quantity is required": "الكمية مطلوبة",
            "Price per Unit": "سعر الوحدة",
            "Paid Amount": "دفع",
            "Add Command": "إضافة أمر",
            "Command added successfully!": "تمت إضافة الأمر بنجاح!",
            "languages": "لغات",
            "More": "المزيد",
            "Close": "إغلاق",
            "Users": "المستخدمون",
            "Username": "اسم المستخدم",
            "Password": "كلمة المرور",
            "Role": "الدور",
            "Enter Username": "أدخل اسم المستخدم",
            "Enter Password": "أدخل كلمة المرور",
            "Login": "تسجيل الدخول",
            "Search by client name...": "ابحث عن اسم العميل...",
            "Add User": "أضف مستخدم",
            "Cancel": "إلغاء",
            "Save": "حفظ",
            "Modify Command": "تعديل طلبية",
            "Add Client": "أضف زبون",
            "Settings": "الإعدادات",
            "Settings Global": "الإعدادات العامة",
            "Total Quantity": " العدد",
            "Total Amount": " الثمن",
            "Total money Given": "دفع  ",
            "Total Rest Amount": " الباقي",
            "name": "الاسم",
            "Location Name": "اسم الموقع",
            "phone number": "رقم التليفون",
            "Balance": "كريدي",
            "Create User": "أضف مستخدم"
        }
    },
    fr: {
        translation: {
            "Welcome": "Bienvenue",
            "Create": "Créer",
            "Commands": "Commandes",
            "Logout": "Se déconnecter",
            "Al morakochi": "Al morakochi",
            "Client": "Client",
            "Address": "Adresse",
            "Product": "Produit",
            "Price": "Prix",
            "Quantity": "Quantité",
            "Total": "Total",
            "Remain": "Reste",
            "Status": "Statut",
            "Date": "Date",
            "Actions": "Actions",
            "Amount": "Montant",
            "Paid": "Payé",
            "Not Paid": "Non payé",
            "Modify": "Modifier",
            "Delete": "Supp",
            "Create New Command": "Créer une nouvelle commande",
            "Command Owner": "Propriétaire de la commande",
            "Client Address": "Adresse du client",
            "Product Name": "Nom du produit",
            "Quantity is required": "La quantité est requise",
            "Price per Unit": "Prix par unité",
            "Paid Amount": "Montant payé",
            "Add Command": "Ajouter une commande",
            "Command added successfully!": "Commande ajoutée avec succès!",
            "languages": "Langues",
            "More": "Plus",
            "Close": "Fermer",
            "Users": "Utilisateurs",
            "Username": "Nom d'utilisateur",
            "Password": "Mot de passe",
            "Role": "Rôle",
            "Enter Username": "Entrez le nom d'utilisateur",
            "Enter Password": "Entrez le mot de passe",
            "Login": "Connexion",
            "Search by client name...": "Rechercher par nom de client...",
            "Add User": "Ajouter",
            "Cancel": "Annuler",
            "Save": "Enregistre",
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'ar', // Default language set to Arabic
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
