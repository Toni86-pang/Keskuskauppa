import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import {
  Paper,
  Grid,
  ButtonBase,
  Typography,
  styled,
  Box,
} from "@mui/material";

interface Product {
  product_ID: number;
  title: string;
  category_ID: number;
  subcategory_ID: number;
  location: string;
  description: string;
  price: number;
}

export function loader({ params }: any) {
  console.log(params.id);
  return params.id;
}

// Image testiä varten

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

////

export default function Product() {
  const [product, setProduct] = useState<Product | null>(null);
  // const [loggedIn, setLoggedIn] = useState(true)

  const id = useLoaderData() as string;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get("/api/product/" + id);
        setProduct(response.data);
      } catch (error) {
        console.error("error fetching products", error);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <Paper
      sx={{
        p: 2,
        margin: "auto",
        marginTop: 2,
        maxWidth: 500,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
      }}
    >
      <Grid container spacing={5}>
        <Grid item>
          <Typography gutterBottom variant="subtitle1" component="div">
            {product?.title}
          </Typography>
          <ButtonBase sx={{ width: 250, height: 250, border: "solid" }}>
            <Img alt="Image" src="/static/images/grid/complex.jpg" />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs sx={{ marginTop: 15 }}>
              <Typography variant="body2" gutterBottom>
                {product?.price} €
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Myyjän nimi
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Star review
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product?.location}
              </Typography>
            </Grid>
            <Grid item>
              <button>Ostoskoriin</button>
              <button>Viesti</button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={5}>
        <Grid item>
          <h4>Lisätiedot:</h4>
          <Box sx={{ border: 1 }} width={500}>
            {product?.description}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
