import CustomError from "../types/errors";
import { Either, failure, success } from "../types/either";
import { Photo } from "../store/photos";

/** 
    This const should be an env variable but it's not really possible
    S3 is a templating engine (not web server) so it doesn't support env.
    It's still okay, not big issue.
*/
const API_ENDPOINT = "https://api.idontlikecamerashake.com/uploadUrl"

type GetUploadUrlReceipt = {
    message: string,
    uploadUrl: string,
    imageId: string,
    futureImageUrl: string
}

const getUploadUrl = async(photo: Photo): Promise<Either<GetUploadUrlReceipt, CustomError>> => {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileType: photo.file.type })
        });

        if (!response.ok) {
            return failure(new CustomError("TODO: couldn't reach"))
        }
        const data: GetUploadUrlReceipt = await response.json();
        return success(data)
    } catch (error) {
        console.error('Error uploading photos:', error);
        return failure(new CustomError(`Error uploading photos: ${error}`, ));
    }
}

const uploadPhoto = async (uploadUrl: string, photo: Photo): Promise<Either<true, CustomError>> => {
    try {
        const response = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
            'Content-Type': photo.file.type,
            },
            body: photo.file
        });

        if (!response.ok) {
            const errorText = await response.text();
            return failure(new CustomError(`Failed to upload ${photo.file.name}: ${errorText}`));
        } else {
            return success(true);
        }
    } catch (error) {
        return failure(new CustomError(`Failed to upload ${photo.file.name}: ${error}`));
    }
};

type uploadPhotoReceipt = {
    imageId: string
    futureImageUrl: string
    timestamp: Date
}

const handlePhoto = async (photo: Photo): Promise<Either<uploadPhotoReceipt, CustomError>> => {
    let receipt: GetUploadUrlReceipt;

    const getUploadUrlResult = await getUploadUrl(photo);
    if (getUploadUrlResult.isSuccess()) {
        receipt = getUploadUrlResult.value;
    } else {
        return failure(getUploadUrlResult.error);
    }

    const uploadUrl = receipt.uploadUrl
    const uploadPhotoResult = await uploadPhoto(uploadUrl, photo);
    if (uploadPhotoResult.isSuccess()) {
        const uploadPhotoReceipt: uploadPhotoReceipt = {
            imageId: receipt.imageId,
            futureImageUrl: receipt.futureImageUrl,
            timestamp: new Date() 
        }
        return success(uploadPhotoReceipt)
    } else {
        return failure(uploadPhotoResult.error);
    }
};

export {handlePhoto}
export type {uploadPhotoReceipt};