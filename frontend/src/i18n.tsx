// i18n.ts
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
            // Add more translations here as needed
        }
    },
    ar: {
        translation: {
            "Welcome": "مرحبا",
            "Create": "اشتر",
            "Commands": "الأوامر",
            "Logout": "تسجيل خروج",
            "Al morakochi": "المراكشي",
            "Client": "عميل",
            "Address": "عنوان",
            "Product": "منتج",
            "Price": "سعر المنتج",
            "Quantity": "الكمية",
            "Total": "السعر الإجمالي",
            "Remain": "المبلغ المتبقي",
            "Status": "الحالة",
            "Date": "التاريخ",
            "Amount": "السعر المدفوع",
            "Actions": "الإجراءات",
            "Paid": "تم الدفع",
            "Not Paid": "لم يتم الدفع",
            "Modify": "تعديل",
            "Delete": "حذف",
            "Create New Command": "إنشاء أمر جديد",
            "Command Owner": "مالك الأمر",
            "Client Address": "عنوان العميل",
            "Product Name": "اسم المنتج",
            "Quantity is required": "الكمية مطلوبة",
            "Price per Unit": "سعر الوحدة",
            "Paid Amount": "المبلغ المدفوع",
            "Add Command": "إضافة أمر",
            "Command added successfully!": "تمت إضافة الأمر بنجاح!",
            "languages": "لغات",
            // Add more translations here as needed
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
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // Default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
