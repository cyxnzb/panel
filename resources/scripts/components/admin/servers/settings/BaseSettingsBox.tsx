import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { useFormikContext } from 'formik';
import type { ReactNode } from 'react';
import tw from 'twin.macro';

import { useServerFromRoute } from '@/api/admin/server';
import AdminBox from '@/components/admin/AdminBox';
import OwnerSelect from '@/components/admin/servers/OwnerSelect';
import Field from '@/components/elements/Field';

export default ({ children }: { children?: ReactNode }) => {
    const { data: server } = useServerFromRoute();
    const { isSubmitting } = useFormikContext();

    return (
        <AdminBox icon={faCogs} title={'设置'} isLoading={isSubmitting}>
            <div css={tw`grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6`}>
                <Field id={'name'} name={'name'} label={'服务器名称'} type={'text'} placeholder={'我的服务器'} />
                <Field id={'externalId'} name={'externalId'} label={'外部 ID'} type={'text'} />
                <OwnerSelect selected={server?.relationships.user} />
                {children}
            </div>
        </AdminBox>
    );
};
