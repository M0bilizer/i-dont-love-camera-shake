import { Photo } from "../types";
import CustomError from "../types/errors";
import { DataResult } from "../types/result";

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

const getUploadUrl = async(): Promise<DataResult<GetUploadUrlReceipt>> => {
    const errors: CustomError[] = [];
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            errors.push(new CustomError("TODO: couldn't reach"))
        }

        const data: GetUploadUrlReceipt = await response.json();
        return new DataResult(data, errors)
    } catch (error) {
        console.error('Error uploading photos:', error);
        return new DataResult<GetUploadUrlReceipt>(null, errors);
    }
}

const uploadPhoto = async (uploadUrl: string, photo: Photo): Promise<DataResult<null>> => {
    const errors: CustomError[] = [];
    try {
        const response = await fetch(uploadUrl, {
            method: 'PUT',
            body: photo.file,
            headers: {
                'Content-Type': photo.file.type,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            errors.push(new CustomError(`Failed to upload ${photo.file.name}: ${errorText}`));
        }
    } catch (error) {
        new CustomError(`Failed to upload ${photo.file.name}: ${error}`);
    } finally {
        return new DataResult(null, errors)
    }
};

type SuccessUpload = {
    isSuccess: true;
    futureImageUrl: string
}

type FailureUpload = {
    isSuccess: false;
    errors: CustomError[]
}

type uploadPhotosReceipt = SuccessUpload | FailureUpload

const uploadPhotos = async (photos: Photo[]): Promise<uploadPhotosReceipt[]> => {
    const uploadPhotosReceipts: uploadPhotosReceipt[] = [];
    for (const photo of photos) {
        const uploadUrlResult = await getUploadUrl();
        if (uploadUrlResult.hasErrors()) {
            console.error('Errors occurred while getting upload URL:', uploadUrlResult.getErrors());
            uploadPhotosReceipts.push({isSuccess: false, errors: uploadUrlResult.getErrors()});
            break;
        }

        const uploadUrlReceipt = uploadUrlResult.getData();

        const result = await uploadPhoto(uploadUrlReceipt.uploadUrl, photo);
        if (result.hasErrors()) {
            uploadPhotosReceipts.push({isSuccess: false,errors: result.getErrors()});
            break;
        }
        uploadPhotosReceipts.push({isSuccess: true, futureImageUrl: uploadUrlReceipt.futureImageUrl})
    }
    return uploadPhotosReceipts;
};

export {uploadPhotos}