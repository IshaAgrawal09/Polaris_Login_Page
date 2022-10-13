import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  Card,
  Page,
  DataTable,
  Pagination,
  Select,
  Spinner,
  Heading,
  TextField,
  Frame,
  Loading,
} from "@shopify/polaris";
// import { Loading } from "@shopify/polaris/build/ts/latest/src/components/Frame/components";
const Home = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState("5");
  const [pagination, setPagination] = useState(1);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState();

  const [filterEquals, setFilterEquals] = useState([
    { type: "user_id", val: "-1", text: "" },
    { type: "catalog", val: "-1", text: "" },
    { type: "username", val: "-1", text: "" },
    { type: "shops.email", val: "-1", text: "" },
    { type: "shopify_plan", val: "-1", text: "" },
    { type: "updated_at", val: "-1", text: "" },
    { type: "created_at", val: "-1", text: "" },
    { type: "shop_url", val: "-1", text: "" },
  ]);
  console.log(filterEquals);
  const options = [
    { label: "Equals", value: "1" },
    { label: "Not Equals", value: "2" },
    { label: "Contains", value: "3" },
    { label: "Does Not Contains", value: "4" },
    { label: "Starts With", value: "5" },
    { label: "Ends With", value: "6" },
  ];
  var sel = Array(filterEquals.length)
    .fill(0)
    .map((item, idx) => {
      return (
        <>
          <Select
            placeholder="--select--"
            options={options}
            onChange={(value) => {
              // debugger;
              var temp = filterEquals;
              temp[idx].val = value;
              setFilterEquals([...temp]);
            }}
            value={filterEquals[idx].val}
          />
          <br />
          <TextField
            value={filterEquals[idx].text}
            onChange={(value) => {
              var temp = filterEquals;
              temp[idx].text = value;
              setFilterEquals([...temp]);
            }}
          />
        </>
      );
    });

  // SELECT ROWS PER PAGE
  console.log(filterEquals[0]);
  // USE EFFECT HOOK
  useEffect(() => {
    var str = "";
    filterEquals.map((item, index) => {
      if (item.text !== "") {
        str += `&filter[${item.type}][${item.val}] = ${item.text}`;
      }
    });

    if (window.controller) {
      window.controller.abort();
    }

    window.controller = new AbortController();
    var signal = window.controller.signal;

    const requestOptions = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
      signal: signal,
    };

    setLoading(true);
    fetch(
      `https://fbapi.sellernext.com/frontend/admin/getAllUsers?activePage=${pagination}&count=${selected}+${str}`,
      requestOptions
    )
      .then((response) => response.json())

      .then((actualData) => {
        setCount(actualData.data.count);
        console.log(actualData);
        let tempArr = [];
        actualData.data.rows.forEach((item) => {
          tempArr.push([
            item.user_id,
            item.catalog,
            item.username,
            item.email,
            item.shopify_plan,
            item.updated_at,
            item.created_at,
            item.shop_url,
          ]);
        });

        setData(tempArr);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selected, pagination, filterEquals]);

  const handleSelectChange = useCallback((value) => setSelected(value), []);
  const optionsPerRow = [
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "15", value: "15" },
    { label: "20", value: "20" },
  ];

  return (
    <div className="homePage">
      {loading ? (
        <Frame>
          <Loading />
        </Frame>
      ) : null}
      <div className="homeHead">
        <Text variant="heading2xl" as="h3">
          Home Page
        </Text>
      </div>
      <div className="section1">
        <Page title="Data Grid..." />
        <Heading>
          Showing from {pagination} of {count} Pages.
        </Heading>
      </div>
      <div className="section2">
        <Card sectioned>
          <div className="Parts">
            <div className="pagination">
              <Pagination
                label="Results"
                hasPrevious={pagination > 1}
                onPrevious={() => setPagination(pagination - 1)}
                hasNext
                onNext={() => {
                  setPagination(pagination + 1);
                  console.log("Next");
                }}
              />
            </div>
            <div className="rows">
              <Select
                label="Row Per Page"
                labelInline
                options={optionsPerRow}
                onChange={handleSelectChange}
                value={selected}
              />
            </div>
          </div>
        </Card>
      </div>

      {false ? (
        <div className="spinner">
          <Spinner accessibilityLabel="Spinner example" size="large" />
        </div>
      ) : (
        <div className="section3">
          <Card sectioned>
            <DataTable
              columnContentTypes={[
                "numeric",
                "numeric",
                "text",
                "text",
                "text",
                "text",
                "text",
              ]}
              headings={[
                "UserID",
                "Catalog",
                "Shop Domain",
                "Shop Email",
                "Shop Plan Name",
                "Updated At",
                "Created At",
                "Shops myShopify Domain",
              ]}
              rows={[sel, ...data]}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Home;
