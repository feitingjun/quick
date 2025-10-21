import React from 'react';

/**更加name获取fixedContext */
declare function getFixedContext(name: string): React.Context<any>[] | undefined;

export { getFixedContext };
