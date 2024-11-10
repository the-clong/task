/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { message } from 'antd';

/**
 * @description 方便使用antd表格，提供了分页自动处理功能
 * @param request 请求方法
 * @param deps 表格重置的依赖项，任意依赖项发生变化，重置页码为1，自动调用request方法
 * @param Options 自定义选项
 * @returns Result<T>
 */

export default function useAntdTable(
    request,
    deps,
    tableProps,
    options,
){
    const [dataList, setDataList] = useState([]); // 列表数据
    const defaultPageSize = (tableProps?.pagination && tableProps?.pagination.defaultPageSize) || 10;
    const [pageParams, setPageParams] = useState({
        pageNum: 1,
        pageSize: defaultPageSize,
    }); // 当前页码及每页条数

    const [total, setTotal] = useState(0); // 数据总条数
    const [isFetching, setIsFetching] = useState(false); // 是否处于请求中
    const isInitFlagRef = useRef(true); // 标示下是否是首次初始化渲染

    const { isInit = true } = options || {};

    const fetchData = async () => {
        try {
            setIsFetching(true);
            // eslint-disable-next-line no-shadow
            const { data, total } = (await request(pageParams)) || {};

            setDataList(data || []);
            setTotal(total || 0);
        } catch (error) {
            message.error(error.message || error.msg || '加载列表出错');
            setDataList([]);
        }

        isInitFlagRef.current = false;
        setIsFetching(false);
    };

    const stopInitReq = useRef(isInit === false);

    // 分页请求
    useEffect(() => {
        if (stopInitReq.current) { // isInit选项为true,禁止初始化时候去请求列表
            stopInitReq.current = false;

            return;
        }

        fetchData();
    }, [pageParams]);

    // 依赖项变化，重置分页
    useEffect(() => {
        const isNeedRest = isInitFlagRef.current === false; // 只在更新场景才调用重置，首次初始化不需要

        isNeedRest && setPageParams({
            ...pageParams,
            pageNum: 1,
        });
    }, deps);

    const onChange = ({ current, pageSize }) => {
        setPageParams({
            pageNum: pageSize === pageParams.pageSize ? current : 1,
            pageSize,
        });
    };

    return {
        tableProps: {
            ...tableProps,
            loading: isFetching,
            onChange,
            dataSource: dataList,
            pagination: tableProps?.pagination !== false && {
                ...tableProps?.pagination,
                current: pageParams.pageNum,
                pageSize: pageParams.pageSize,
                total,
            },
        },
        resetTable() {
            setPageParams({
                ...pageParams,
                pageNum: 1,
            });
            setTotal(0);
            setDataList([]);
        },
        reloadTable() {
            fetchData();
            setTotal(0);
            setDataList([]);
        },
    };
}
