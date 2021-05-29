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
      { Header: "Symbol", accessor: "symbol", className: 'sticky' },
    ];
    items?.forEach((el, idx) => {
      if (idx !== 0) {
        res.push({
          Header: 'CHG',
          accessor: el.timestamp.toString() + 'CHG',
        });
        res.push({
          Header: 'VOL',
          accessor: el.timestamp.toString() + 'VOL',
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
        const data = { symbol: <a href={'https://www.binance.com/en/trade/' + el.symbol} target={'_blank'}>{el.symbol}</a> };
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
          data[ts + 'VOL'] = ((Math.round(previousItem?.volume /
            currentItem?.volume * 1000) / 10) - 100).toFixed(1) + '%';
          const change = (Math.round(previousItem?.lastPrice /
            currentItem?.lastPrice * 1000) / 10) - 100;
          if (change !== 0.0) {
            data[ts + 'CHG'] = change.toFixed(1) + '%';
          }
        });
        return data;
      }) || [],
    [items]
  );

  console.log({ columns, data, filteredUSDTCoins, filteredItems, items });

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
      initialState: {
        sortBy: [
          {
            id: 'Symbol',
            desc: false,
          }
        ]
      }

    },
    useSortBy
  );

  useEffect(() => {
    axios.defaults.baseURL = "https://api.binance.com";
    axios.get("/api/v3/ticker/24hr").then((r) =>
      setItems((current) => {
        const newItems = [...current];
        if (current.length > 10) {
          newItems.splice(0, current.length - 9);
        }
        newItems.unshift({
          timestamp: dayjs().unix(),
          data: r.data.map((el) => ({
            symbol: el.symbol,
            volume: el.quoteVolume,
            lastPrice: el.lastPrice,
          })),
        });
        return newItems;
      })
    );
  }, []);

  return (
    <BTable striped bordered hover size="sm" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th>
                <div style={{ display: "flex", justifyContent: "space-between"}}>
                  <div {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    {column.isSorted ? (column.isSortedDesc ? "🔽" : "🔼") : ""}
                  </div>
                  {!isNaN(column.id) && <a href='#' onClick={() =>
                    setItems(current => {
                      const idx = current.find(
                        el => el.timestamp === +column.id);
                      if (idx !== -1) {
                        const newItems = [...current];
                        newItems.splice(idx, 1);
                        return newItems;
                      }
                    })}>X
                  </a>}
                </div>
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
              {row.cells.map((cell, idx) => (
                <td style={idx === 0 ? {position: 'sticky', left: 0, top: 0, backgroundColor: 'white'} : null}
                    {...cell.getCellProps()}>{cell.render("Cell")}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </BTable>
  );
}

export default App;
