"use client";

import { Container, Typography, Box, Paper, Grid } from "@mui/material";
import { Restaurant, AccessTime, LocationOn, Phone } from "@mui/icons-material";


export default function About() {
  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="text-center mb-12">
        <Typography variant="h2" component="h1" className="mb-4">
          About Our Restaurant
        </Typography>
        <Typography variant="h5" className="text-gray-600 mb-4">
          Serving delicious food since 1990
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-8 h-full">
            <Typography variant="h4" className="mb-4">
              Our Story
            </Typography>
            <Typography className="mb-4">
              Founded in 1990, our restaurant has been serving the community
              with the finest cuisine for over three decades. We believe in
              using only the freshest ingredients and traditional cooking
              methods to bring you an authentic dining experience.
            </Typography>
            <Typography className="mb-4">
              Our chefs bring years of experience and passion to every dish they
              create, ensuring that each meal is a memorable experience for our
              guests.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-8 h-full">
            <Typography variant="h4" className="mb-4">
              Our Mission
            </Typography>
            <Typography className="mb-4">
              We strive to provide exceptional dining experiences by combining
              traditional recipes with modern culinary techniques. Our
              commitment to quality and service has made us a beloved
              destination for food lovers.
            </Typography>
            <Typography className="mb-4">
              We believe in sustainable practices and source our ingredients
              from local suppliers whenever possible, supporting our community
              while delivering the best flavors to our customers.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} className="p-8 mt-4">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box className="text-center">
                  <AccessTime className="text-5xl mb-2" />
                  <Typography variant="h6" className="mb-2">
                    Opening Hours
                  </Typography>
                  <Typography>
                    Monday - Friday: 11:00 AM - 10:00 PM
                    <br />
                    Saturday - Sunday: 10:00 AM - 11:00 PM
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box className="text-center">
                  <LocationOn className="text-5xl mb-2" />
                  <Typography variant="h6" className="mb-2">
                    Location
                  </Typography>
                  <Typography>
                    123 Restaurant Street
                    <br />
                    City, State 12345
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box className="text-center">
                  <Phone className="text-5xl mb-2" />
                  <Typography variant="h6" className="mb-2">
                    Contact
                  </Typography>
                  <Typography>
                    Phone: (555) 123-4567
                    <br />
                    Email: info@restaurant.com
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} className="p-8 mt-4">
            <Typography variant="h5" className="mb-6">
              Find Us
            </Typography>
            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12063.7129567017!2d-51.3131102!3d35.7495159!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x46289ec3b50eabb9!2sMove%20Plus!5e0!3m2!1sen!2sus!4v1613186587593!5m2!1sen!2sus" className="w-full h-[400px]" aria-hidden="false"></iframe>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
