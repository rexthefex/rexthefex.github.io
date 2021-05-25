import "./App.css";
import { useTable, useSortBy } from "react-table";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BTable from "react-bootstrap/Table";
import { useLocalStorage } from "./useLocalStorage";
import dayjs from "dayjs";

function App() {
  const [items, setItems] = useLocalStorage("items", []);
  const columns = useMemo(() => {
    let res = [
      { Header: "Symbol", accessor: "symbol" },
      { Header: "Volume", accessor: "volume" },
    ];
    items?.forEach((el, idx) => {
      if (idx !== 0) {
        res.push({
          Header: 'CHG',
          accessor: el.timestamp.toString() + 'CHG',
        });
      }
      res.push({
        Header: el.timestamp
          ? dayjs.unix(el.timestamp).format("HH:mm:ss")
          : null,
        accessor: el.timestamp.toString(),
      });
    });
    return res;
  }, [items]);

  const availableCoinsInUSDT = useMemo(() => {
    return items?.[items?.length - 1]?.data
      .filter((el) => el.symbol.includes("USDT"))
      .filter(
        (el) =>
          !el.symbol.includes("BULL") &&
          !el.symbol.includes("BEAR") &&
          !el.symbol.includes("UP") &&
          !el.symbol.includes("DOWN")
      )
      .filter((el) => el.symbol.endsWith("USDT"))
      .map((el) => ({
        symbol: el.symbol.replace("USDT", ""),
        volume: el.volume,
      }));
  }, [items]);

  const filteredUSDTCoins = useMemo(
    () =>
      availableCoinsInUSDT
        ?.filter((el) => parseFloat(el.volume) > 100000)
        .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume)),
    [availableCoinsInUSDT]
  );

  const filteredItems = useMemo(() => {
    const data = items?.[items.length - 1]?.data;
    return data?.filter(
      (el) =>
        el.symbol.includes("BTC") &&
        filteredUSDTCoins.some((coin) => el.symbol.includes(coin.symbol))
    ) || [];
  }, [filteredUSDTCoins, items]);

  const data = useMemo(
    () =>
      filteredItems.map((el) => {
        const symbol = el.symbol;
        const data = { symbol };
        items.forEach((item, idx) => {
          const currentItem = item.data.find(
            (dataItem) => dataItem.symbol === symbol
          );
          const previousItem = items[idx-1]?.data.find(
            (dataItem) => dataItem.symbol === symbol
          )
          const ts = item.timestamp.toString();
          if (currentItem?.lastPrice.endsWith('000000')) {
            data[ts] = currentItem?.lastPrice.replace('000000', '');
          } else {
            data[ts] = currentItem?.lastPrice.replace('00000000', '');
          }
          const change = (Math.round(currentItem?.lastPrice / previousItem?.lastPrice * 1000) / 10) - 100;
          if (change !== 0.0) {
            data[ts + 'CHG'] = change.toFixed(1) + '%';
          }
        });
        return data;
      }) || [],
    [items]
  );

  console.log({ columns, data, filteredUSDTCoins, filteredItems });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  useEffect(() => {
    axios.defaults.baseURL = "https://api.binance.com";
    axios.get("/api/v3/ticker/24hr").then((r) =>
      setItems((current) => [
        ...current,
        {
          timestamp: dayjs().unix(),
          data: r.data.map((el) => ({
            symbol: el.symbol,
            volume: el.quoteVolume,
            lastPrice: el.lastPrice,
          })),
        },
      ])
    );
  }, []);

  return (
    <BTable striped bordered hover size="sm" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? "🔽" : "🔼") : ""}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </BTable>
  );
}

export default App;
