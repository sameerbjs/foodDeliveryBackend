import Resturant from "../model/resturant.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import {generateToken} from "../helper/token.js";

export const resturantRegister = async (req, res) => {
    const {name, email, city, address, password, phone, isUser} = req.body;

    const chkExsit = await Resturant.findOne({email});
    const filePath = path.join(req.file.path);
    if (chkExsit) {
        fs.unlink(filePath, (err) => {
            if (err)
                return res.status(400).send({
                    error: "File cannot be deleted chkExsist",
                });
        });
        return res
            .status(400)
            .send({error: "Resturant already registered with this email"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const rest = await Resturant.create({
        name: name,
        email: email,
        city: city,
        address: address,
        isUser: isUser,
        phone: phone,
        password: hashedPassword,
        profilePic: req.file.filename,
        profilePath: req.file.path,
    });

    if (rest) {
        return res
            .status(200)
            .send({message: "Resturant registered successfully"});
    } else {
        return res.status(400).send({error: "Resturant dose'nt registered"});
    }
};

export const resturantLogin = async (req, res) => {
    const restFind = await Resturant.findOne({email: req.body.email});
    if (restFind) {
        const match = await bcrypt.compare(
            req.body.password,
            restFind.password
        );

        if (match) {
            res.status(200).send({
                _id: restFind._id,
                name: restFind.name,
                email: restFind.email,
                isUser: restFind.isUser,
                profilePic: restFind.profilePic,
                profilePath: restFind.profilePath,
                token: generateToken(restFind._id),
            });
        } else {
            return res.status(400).send({error: "Invalid credentials"});
        }
    } else {
        return res.status(400).send({error: "Resturant dose not exsist"});
    }
};
