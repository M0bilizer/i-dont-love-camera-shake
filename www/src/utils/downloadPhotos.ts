const downloadImage = async (url: string): Promise<boolean> => {
    try {
        const response = await fetch(url,  {
            method: 'GET',
            mode: 'cors',
        });
        if (response.ok) {
            const blob = await response.blob();
            const link = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            link.href = objectUrl;
            link.download = url.split('/').pop() || 'download'; // Set the download attribute to the key (file name)
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(objectUrl);
            return true; // Indicate success
        }
        throw new Error('Failed to download image');
    } catch (error) {
        console.error('Error downloading image:', error);
        return false; // Indicate failure
    }
};

const attemptDownload = (url: string, interval = 5000, maxAttempts = 20) => {
    let attempts = 0;
    const downloadInterval = setInterval(async () => {
        attempts++;
        const success = await downloadImage(url);
        if (success) {
            clearInterval(downloadInterval);
            console.log('Image downloaded successfully');
        } else if (attempts >= maxAttempts) {
            clearInterval(downloadInterval);
            console.error('Maximum download attempts reached. Failed to download image.');
        } else {
            console.log('Retrying download...');
        }
    }, interval);
};


export default attemptDownload;