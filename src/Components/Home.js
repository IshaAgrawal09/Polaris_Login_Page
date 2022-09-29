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
} from "@shopify/polaris";
const Home = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState("5");
  const [pagination, setPagination] = useState(1);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState();
  const [selectEquals,setSelectEquals] = useState("Equals")
  useEffect(() => {
    const requestOptions = {
      headers: {
        // "Content-Type": "application/json",
        // Accept: "application/json",
        authorization: localStorage.getItem("token"),
      },
    };
    setLoading(true);
    fetch(
      `https://fbapi.sellernext.com/frontend/admin/getAllUsers?activePage=${pagination}&count=${selected}`,
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
        let selectArr = [];
        for (let i = 0; i < 8; i++) {
          selectArr.push(
            <Select
              options={options}
              onChange={handleSelectEqualsChange}
              value={selectEquals}
            />
          );
        }
        tempArr.unshift(selectArr);
        setData(tempArr);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selected, pagination]);

  const handleSelectChange = useCallback((value) => setSelected(value), []);
  const optionsPerRow = [
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "15", value: "15" },
    { label: "20", value: "20" },
  ];

  const handleSelectEqualsChange = useCallback((values) => setSelectEquals(values), [])
  const options = [
    { label: "Equals", values: "Equals" },
    { label: "Not Equals", values: "Not Equals" },
   
  ];

  return (
    <div className="homePage">
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

      {loading ? (
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
              rows={data}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Home;
