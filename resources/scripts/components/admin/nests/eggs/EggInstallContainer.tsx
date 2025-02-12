import { LanguageDescription, LanguageSupport, StreamLanguage } from '@codemirror/language';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { faScroll } from '@fortawesome/free-solid-svg-icons';
import type { FormikHelpers } from 'formik';
import { Form, Formik } from 'formik';
import tw from 'twin.macro';

import { useEggFromRoute } from '@/api/admin/egg';
import updateEgg from '@/api/admin/eggs/updateEgg';
import AdminBox from '@/components/admin/AdminBox';
import { Button } from '@/components/elements/button';
import { Editor } from '@/components/elements/editor';
import Field from '@/components/elements/Field';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import useFlash from '@/plugins/useFlash';

interface Values {
    scriptContainer: string;
    scriptEntry: string;
    scriptInstall: string;
}

export default function EggInstallContainer() {
    const { clearFlashes, clearAndAddHttpError } = useFlash();

    const { data: egg } = useEggFromRoute();

    if (!egg) {
        return null;
    }

    let fetchFileContent: (() => Promise<string>) | null = null;

    const submit = async (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        if (fetchFileContent === null) {
            return;
        }

        values.scriptInstall = await fetchFileContent();

        clearFlashes('egg');

        updateEgg(egg.id, values)
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'egg', error });
            })
            .then(() => setSubmitting(false));
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                scriptContainer: egg.scriptContainer,
                scriptEntry: egg.scriptEntry,
                scriptInstall: '',
            }}
        >
            {({ isSubmitting, isValid }) => (
                <AdminBox icon={faScroll} title={'安装脚本'} noPadding>
                    <div css={tw`relative pb-4`}>
                        <SpinnerOverlay visible={isSubmitting} />

                        <Form>
                            <Editor
                                className="mb-4"
                                childClassName={tw`h-96`}
                                initialContent={egg.scriptInstall || ''}
                                fetchContent={value => {
                                    fetchFileContent = value;
                                }}
                                language={LanguageDescription.of({
                                    name: 'shell',
                                    support: new LanguageSupport(StreamLanguage.define(shell)),
                                })}
                            />

                            <div css={tw`mx-6 mb-4`}>
                                <div css={tw`grid grid-cols-3 gap-x-8 gap-y-6`}>
                                    <Field
                                        id={'scriptContainer'}
                                        name={'scriptContainer'}
                                        label={'安装容器'}
                                        type={'text'}
                                        description={'用于运行此安装脚本的 Docker 镜像。'}
                                    />

                                    <Field
                                        id={'scriptEntry'}
                                        name={'scriptEntry'}
                                        label={'安装入口命令'}
                                        type={'text'}
                                        description={'应该用于在安装容器内运行此脚本的命令。'}
                                    />
                                </div>
                            </div>

                            <div css={tw`flex flex-row border-t border-neutral-600`}>
                                <Button type="submit" css={tw`ml-auto mr-6 mt-4`} disabled={isSubmitting || !isValid}>
                                    保存更改
                                </Button>
                            </div>
                        </Form>
                    </div>
                </AdminBox>
            )}
        </Formik>
    );
}
