import fs from "node:fs/promises";
import path from "node:path";

import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const filename = fileURLToPath(import.meta.url);

const directory = path.dirname(filename);

const contactsPath = path.join(directory, "db", "contacts.json");


export async function listContacts() {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    return contacts;
}

export async function getContactById(contactId) {
    const contacts = await listContacts();
    const contact = contacts.find(contact => contact.id === contactId);
    return contact ?? null;
}

export async function removeContact(contactId) {
    const contacts = await listContacts();
    const contactToRemove = await getContactById(contactId);
    if (contactToRemove === null) {
        return null
    }
    const updatedContacts = contacts.filter(
        contact => contact.id !== contactId
    );
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts), "utf-8");
    return contactToRemove
}

export async function addContact(name, email, phone) {
    const id = randomUUID();
    const contacts = await listContacts();
    const newContact = {
        id: id,
        name,
        email,
        phone
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact
}

