import React, { useMemo } from 'react';
import ImageUploader from './ImageUpload/ImageUpload';

import './AddPhoto.scss';

function AddPhoto() {
    const maxFileSize = useMemo(() => parseInt(process.env.MAX_FILE_UPLOAD_SIZE || '', 10), []);

    return (
        <section className="AddPhoto">
            {/* <ImageUploader className="ImageUploader" maxFileSize={maxFileSize} withIcon={false} withLabel={false} withPreview /> */}
            <ImageUploader />
        </section>
    );
}

export default AddPhoto;
