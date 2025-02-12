import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { useFormikContext } from 'formik';
import tw from 'twin.macro';

import AdminBox from '@/components/admin/AdminBox';
import Field from '@/components/elements/Field';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';

export default () => {
    const { isSubmitting } = useFormikContext();

    return (
        <AdminBox icon={faNetworkWired} title={'监听'} css={tw`w-full relative`}>
            <SpinnerOverlay visible={isSubmitting} />

            <div css={tw`mb-6 md:w-full md:flex md:flex-row`}>
                <div css={tw`mb-6 md:w-full md:flex md:flex-col md:mr-4 md:mb-0`}>
                    <Field id={'listenPortHTTP'} name={'listenPortHTTP'} label={'HTTP 监听端口'} type={'number'} />
                </div>

                <div css={tw`mb-6 md:w-full md:flex md:flex-col md:ml-4 md:mb-0`}>
                    <Field id={'publicPortHTTP'} name={'publicPortHTTP'} label={'HTTP 公共端口'} type={'number'} />
                </div>
            </div>

            <div css={tw`mb-6 md:w-full md:flex md:flex-row`}>
                <div css={tw`mb-6 md:w-full md:flex md:flex-col md:mr-4 md:mb-0`}>
                    <Field id={'listenPortSFTP'} name={'listenPortSFTP'} label={'SFTP 监听端口'} type={'number'} />
                </div>

                <div css={tw`mb-6 md:w-full md:flex md:flex-col md:ml-4 md:mb-0`}>
                    <Field id={'publicPortSFTP'} name={'publicPortSFTP'} label={'SFTP 公共端口'} type={'number'} />
                </div>
            </div>
        </AdminBox>
    );
};
