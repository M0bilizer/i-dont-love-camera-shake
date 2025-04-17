import { Photo } from "../types";
import CustomError from "../types/errors";
import Either from "../types/either";

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

const getUploadUrl = async(photo: Photo): Promise<Either<GetUploadUrlReceipt, CustomError[]>> => {
    const errors: CustomError[] = [];
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
            errors.push(new CustomError("TODO: couldn't reach"))
        }
        const data: GetUploadUrlReceipt = await response.json();
        return Either.success(data)
    } catch (error) {
        console.error('Error uploading photos:', error);
        return Either.failure(errors);
    }
}

const uploadPhoto = async (uploadUrl: string, photo: Photo): Promise<Either<true, CustomError[]>> => {
    const errors: CustomError[] = [];
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
            errors.push(new CustomError(`Failed to upload ${photo.file.name}: ${errorText}`))
            return Either.failure(errors);
        } else {
            return Either.success(true);
        }
    } catch (error) {
        errors.push(new CustomError(`Failed to upload ${photo.file.name}: ${error}`))
        return Either.failure(errors);
    }
};

type uploadPhotoReceipt = {
    imageId: string
    futureImageUrl: string
    timestamp: Date
}

const uploadPhotos = async (photos: Photo[]): Promise<Either<uploadPhotoReceipt, CustomError[]>[]> => {
    const EitherArray: Either<uploadPhotoReceipt, CustomError[]>[] = [];
    for (const photo of photos) {
        let getUploadUrlReceipt: GetUploadUrlReceipt | undefined;
        let uploadIsSuccess: true | undefined;

        const getUploadUrlResult = await getUploadUrl(photo);
        getUploadUrlResult
            .onSuccess((value) => {
                getUploadUrlReceipt = value
            })
            .onFailure((value) => {
                EitherArray.push(Either.failure(value))
            })
        if (!getUploadUrlReceipt)
            break;

        const uploadUrl = getUploadUrlReceipt.uploadUrl;
        const uploadPhotoResult = await uploadPhoto(uploadUrl, photo);   
        uploadPhotoResult
            .onSuccess((value) => {
                uploadIsSuccess = value;
            })
            .onFailure((value) => {
                EitherArray.push(Either.failure(value))
            })
        if (!uploadIsSuccess)
            break;

        EitherArray.push(
            Either.success(
                {...getUploadUrlReceipt, timestamp: new Date()}
            )
        )
    }
    return EitherArray;
};

export {uploadPhotos}
export type {uploadPhotoReceipt};