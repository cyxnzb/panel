import { memo } from 'react';
import isEqual from 'react-fast-compare';

import { Alert } from '@/components/elements/alert';
import Can from '@/components/elements/Can';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import Spinner from '@/components/elements/Spinner';
import Console from '@/components/server/console/Console';
import PowerButtons from '@/components/server/console/PowerButtons';
import ServerDetailsBlock from '@/components/server/console/ServerDetailsBlock';
import StatGraphs from '@/components/server/console/StatGraphs';
import Features from '@feature/Features';
import { ServerContext } from '@/state/server';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

function ServerConsoleContainer() {
    const name = ServerContext.useStoreState(state => state.server.data!.name);
    const description = ServerContext.useStoreState(state => state.server.data!.description);
    const isInstalling = ServerContext.useStoreState(state => state.server.isInstalling);
    const isTransferring = ServerContext.useStoreState(state => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState(state => state.server.data!.eggFeatures, isEqual);
    const isNodeUnderMaintenance = ServerContext.useStoreState(state => state.server.data!.isNodeUnderMaintenance);

    return (
        <ServerContentBlock title={'控制台'}>
            {(isNodeUnderMaintenance || isInstalling || isTransferring) && (
                <Alert type={'warning'} className={'mb-4'}>
                    {isNodeUnderMaintenance
                        ? '此服务器的节点目前正在维护中，所有操作均不可用。'
                        : isInstalling
                        ? '此服务器当前正在运行其安装过程，大多数操作都是不可用的。'
                        : '此服务器当前正在转移到另一个节点，所有操作都不可用。'}
                </Alert>
            )}
            <div className={'mb-4 grid grid-cols-4 gap-4'}>
                <div className={'hidden pr-4 sm:col-span-2 sm:block lg:col-span-3'}>
                    <h1 className={'font-header text-2xl leading-relaxed text-slate-50 line-clamp-1'}>{name}</h1>
                    <p className={'text-sm line-clamp-2'}>{description}</p>
                </div>
                <div className={'col-span-4 self-end sm:col-span-2 lg:col-span-1'}>
                    <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                        <PowerButtons className={'flex space-x-2 sm:justify-end'} />
                    </Can>
                </div>
            </div>
            <div className={'mb-4 grid grid-cols-4 gap-2 sm:gap-4'}>
                <div className={'col-span-4 flex lg:col-span-3'}>
                    <Spinner.Suspense>
                        <Console />
                    </Spinner.Suspense>
                </div>
                <ServerDetailsBlock className={'order-last col-span-4 lg:order-none lg:col-span-1'} />
            </div>
            <div className={'grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-3'}>
                <Spinner.Suspense>
                    <StatGraphs />
                </Spinner.Suspense>
            </div>
            <Features enabled={eggFeatures} />
        </ServerContentBlock>
    );
}

export default memo(ServerConsoleContainer, isEqual);
