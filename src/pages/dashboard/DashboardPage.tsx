import { motion } from "framer-motion";
import * as animation from "../../constants/animations";

export const DashboardPage = () => {
  return (
    <motion.div variants={animation.pageFadePremium} initial="init" animate="visible" exit="exit">
      DashboardPage
    </motion.div>
  );
};
